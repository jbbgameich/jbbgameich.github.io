---
layout: post
title:  "Rust in a KDE Project"
date:   2020-12-21 19:51:30 +1:00
categories: misc
---

While trying to implement a long planned feature, an ad block in Angelfish, the Plasma Mobile webbrowser,
I was looking for a mostly complete and performant library that provides this functionality.

First I found libadblockplus, which is a C++ library providing the AdblockPlus core functionality.
Sounds great, right? Well, not quite. It includes it's own v8 java script engine,
and since we are talking about a webbrowser with a QML interface here,
including a third java script engine and a second copy of v8 was absolutely not an option.
Even if this wasn't a webbrowser,
running a java script engine as implementation detail of a library is at least ... problematic.

The other option I found is [adblock-rust](https://github.com/brave/adblock-rust),
which is the built-in ad block of the Brave browser. As the name tells, it is written in Rust,
and I was originally looking for a C++ library. But it turned out this was not much of a problem,
since Rust features excellent C interoperability, just like C++.
Based on this common ground, bindings can be created to use Rust code from C++ (and the other way around if needed).

## Approach 1
My first approach was to use raw ffi. That means essentially building a C API featuring the typical C primitive types in rust,
and telling the rust compiler to represent structs in memory the same way that C would do.
Thanks to cbindgen, which automatically generates a header file with the information for the C compiler to know which fields a struct has and were they are,
we directly get something we can include in our C++ project.

The rust build system cargo is capable of running custom code at build time, and we can use that to run cbindgen on our rust code, by adding a file named `build.rs`:
```rust
extern crate cbindgen;

use std::env;

fn main() {
    let crate_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    cbindgen::generate(&crate_dir)
        .unwrap()
        .write_to_file("bindings.h");
}
```

Our core data structure for the ad block looks like this:
```rust
#[repr(C)]
pub struct Adblock {
    blocker: *mut Engine,
}
```
It stores a pointer to the rust Engine type in a C compatible struct.
The struct can not be created directly from C / C++, since we don't know anything about the Engine type there.

So we need a function on the rust side that creates and initializes the Engine for us and packs it into an `Adblock` struct.
Since the code in angelfish is doing a bit more than only that, the function takes two C string arguments, and returns a pointer to a mutable (non-const) Adblock object.
```rust
#[no_mangle]
pub extern "C" fn new_adblock(
    list_dir: *const c_char,
    public_domain_suffix_file: *const c_char,
) -> *mut Adblock
```
A few more thigs in this function signature are unusual, but they are all related to the FFI / C compatibility we need here:
- `#[no_mangle]` tells the rust compiler not to apply its rust specific function name mangling
- `extern "C"` tells that this function should use the C calling conventions.

Every time we interact with data from C, the rust compiler is unable to run its usual safety checks.
For that reason we need unsafe blocks around those lines of code.
If anything unexpectedly segfaults, it's likely to be in our unsafe blocks.
To get a string that we can feed into a usual rust API, we can use `unsafe { CStr::from_ptr(public_domain_suffix_file).to_str() }`.

For more examples of how to interact with the C / C++ side, feel free to have a look at [some real code in Angelfish](https://invent.kde.org/plasma-mobile/plasma-angelfish/-/blob/20e166c0fe2e38be63824b957c02fa58865ac67c/src/rs/adblock/src/adblock.rs).
I'm by no means an expert on this, but it should help you get started.

Using this approach, the ad block could successfully be implemented in about 140 lines of rust code, of which only half is FFI code, and the rest actual logic.

## Approach 2
The second approach is to use the cxx crate (library), which can generate most of the boilerplate FFI code automatically, and provides a modern API on the C++ side.
To do that, it implements its own wrapper types, each wrapping the functionality of one type of one of the languages. Those wrapper types are implemented in both languages, and allow easily passing more advanced types than pointers and number types through the FFI boundary.
On the rust side, the wrapper types are not really visible, because a macro generates everything for us.

The only unusual thing on the rust side will be a small ffi module, declaring which types and functions we want to expose to C++:
```rust
#[cxx::bridge]
mod ffi {
    extern "Rust" {
        type Adblock;
        type AdblockResult;

        fn new_adblock(list_dir: &str, suffix_file: &str) -> Box<Adblock>;
        fn should_block(
            self: &Adblock,
            url: &str,
            source_url: &str,
            request_type: &str,
        ) -> Box<AdblockResult>;
    }
}
```

All objects are returned as smart pointers, like `Box`.
On the C++ side, this will result in a `rust::Box<Adblock>`, which is a type generated by the cxx_build crate, which is doing something slightly similar to cbindgen.

With the cxx crate, our build.rs will look like this:
```rust
extern crate cxx_build;

fn main() {
    cxx_build::bridge("src/adblock.rs").compile("angelfish-adblock")
}
```

You may wonder, if the cxx crate makes everything so easy, why did I start with approach 1 at all?
I had had a look at the cxx crate a few month ago, when it was still too minimal to do what I needed. Luckily I had another look, since it has become really useful in the meantime.
However learning the raw ffi way was important to understand what actually happens in the background, and I'd almost recommend everyone to have a look at that first before using the cxx crate. Using `cargo expand` you can then understand what cxx generated for you.

Given the cxx crate makes this so much easier, I initially feared it might add tons of new dependencies and increase the build time, but to my surprise it actually has a lot less dependencies than cbindgen. Even though cbindgen only uses those at build time (they don't end up in the binary), they take some time to build.

Angelfish has recently switched to using the cxx crate, so you find usage examples in the [current version of the ad block code](https://invent.kde.org/plasma-mobile/plasma-angelfish/-/blob/d92e48e392303deda6cf3c1552f9f7b5189e2953/src/rs/adblock/src/adblock.rs).

## Build system
After we have written the FFI, we need to build the Rust code as part of our project, most likely using CMake. This could be very annoying and complicated, but luckily [Corrosion](https://github.com/AndrewGaspar/corrosion) exists to make this very easy for us.
It can build our rust code using the cargo build system, and create CMake targets for the library we built, so its easy to link against it.

## Usage in KDE
Now that the implementation part is explained,
it makes sense to look into where this can be useful and where not.
Unfortunately the truth is that some distros are still not fully happy with having to package rust code,
because the rust community has a different approach to sharing code than known from the C / C++ world.
While Qt re-implements some functionality also found in other C++ libraries, to only make it necessary to package Qt and not one library for json, one for xml, for http and so on, the rust community likes to split everything into small packages, so no unnecessary code is included.

In Angelfish, all the rust code is optional, and Angelfish can of course still be built without Rust.

Possible areas in KDE that could profit from using Rust are icon and SVG theme rendering code, which could profit from using rsvg or resvg.
I can imagine it could also be useful for document thumbnailers, when a rust implementation of the file type already exists. A similar case could be KIO workers, and pretty much any other project that can profit from optional plugins.

## Conclusion
This approach to using Rust in KDE allows to make use of the many libraries and language features the ecosystem provides, without running into the infamous "rewrite it in Rust" reflex. It avoids having to create rust bindings for all KDE Frameworks and Qt only to make use of Rust, and still produces readable code.
