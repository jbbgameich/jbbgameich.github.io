---
layout: post
title:  "Connecting an electric typewriter to a modern computer"
date:   2022-03-12 02:52:00 +1:00
---

My blog post writing delay is huge right now, sorry for that, but here it finally is: the writeup of the typewriter technology I experimented with in January.

This is about a SIGMA SM 8200i typewriter, which my parents gave to me for entertainment purposes when I was a child.
Now that I'm older, the entertainment has shifted more towards the technical internals.

When we talked about teletype technology at my local university hackerspace, Spline, I remembered the typewriter had a 26-pin connector.
After some research, I learned that the machine is basically an Erika S3004, one of the most popular typewriters of the GDR, in a different case.
With this new knowledge, I was able to find a [table of commands](https://hc-ddr.hucki.net/wiki/doku.php/z9001:erweiterungen:s3004) which can be sent and received from the device.

The 26-pin connector is a port used in the GDR, which speaks a faily standard rs232 protocol, with a baud-rate of 1200.
In fact, the USB TTL adapter I usually use for routers, worked on it after some creative wiring.

<figure>
    <img alt="Version 1.0 of the typewriter interface" src="/img/typewriter_interface_1_0.jpeg" width="400">
    <figcaption>The initial attempt at connecting, with lots of tape and no proper connector</figcaption>
</figure>

The commands that can be sent and received over the serial interface can be separated into two groups: control codes and character codes.
Unfortunately the typewriter does not support unicode ... or ASCII.
So the first step was encoding and decoding the "gdrascii" codec, like the Chaostreff Potsdam people like to call it.
Luckily, I could just do a pretty-much 1:1 translation of the [python code from Chaostreff Potsdam](https://github.com/Chaostreff-Potsdam/erika3004) into rust.

For those interested in rust: The new gdrascii_codec crate exposes mostly const API, which allows to write strings in unicode in the source code for readability,
but already translating them into gdrascii at compile time.

After also implementing the control codes from the table, plus some glue code for opening the serial connection with the correct parameters, I could do the first prints.

<figure>
    <video width="400" controls>
        <source src="/vid/typewriter-printing.mp4" type="video/mp4">
    </video>
    <figcaption>Printing Tux</figcaption>
</figure>

The second feature I wanted to support was keyboard input, since the typewriter supports a mode in which it sends keyboard input over the serial connection instead of printing it.
This was quite easily possible using the linux kernel uinput API. The only complication was, that the typewriter already sends ready made character codes, but the linux kernel expects to receive raw keypresses.

For the character "L", the Linux kernel expects "(Left Shift or Right Shift) + L", so this could just be translated back.

<figure>
    <video width="400" controls>
        <source src="/vid/typewriter-typing.mp4" type="video/mp4">
    </video>
    <figcaption>Tooting from the typewriter</figcaption>
</figure>

Once that was all done, I ordered a proper connector so that I could easily put everything back together after putting it in the drawer.

<figure>
    <img alt="Version 2.0 of the typewriter interface" src="/img/typewriter_interface_2_0.JPG" width="400">
    <figcaption>The final result, with a proper connector</figcaption>
</figure>

As always, the source code is open source. This time I published it on [Codeberg](https://codeberg.org/jbb/erika_S3004), together with some documentation on how to wire the device to a serial adapter.

And for those wondering what this project was useful for: probably nothing 😁. It's just cool that technology from such different times still works together so well.
