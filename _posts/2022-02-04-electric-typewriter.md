---
layout: post
title:  "Connecting an Electronic Typewriter to a modern machine"
date:   2022-03-01 15:31:00 +1:00
---

My blog post publishing delay is huge right now, sorry for that, but here it finally is: the writeup of the typewriter technology I experimented with in January.

This is about a SIGMA SM 8200i typewriter, which my parents gave to me for entertainment purposes when I was a child.
Now that I'm older, the entertainment has become more sophisticated 😁.

When we talked about teletype technology in my local university hackerspace, Spline, I remembered the typewriter had a 26-pin connector.
After some research, I learned that the machine is basically an Erika S3004, one of the most popular typewriters of the GDR, in a different case.
With this new knowledge, I was able to find a table of commands which can be sent and received from the device.

The 26-pin conector is a port used in the GDR, which speaks a faily standard rs232 protocol.
In fact, the USB TTL adapter I usually use for routers, worked on it after some creative wiring.

<figure>
    <img alt="Version 1.0 of the typewriter interface" src="/img/typewriter_interface_1_0.jpeg" width="400">
    <figcaption>The initial attempt at connecting, with lots of tape and no proper connector</figcaption>
</figure>

The commands that can be sent and received over the serial interface can be separated into two groups: control codes and character codes.
Unfortunately the typewriter does not support unicode ... or ASCII.
So the first step was encoding and decoding the "gdrascii" codec, like the Chaostreff Potsdam people like to call it.
Luckily, I could just do a pretty-much 1:1 translation of the python code from Chaostreff Potsdam into rust.

For those interested in rust: The new gdrascii_codec crate exposes mostly const API, which allows to write strings in unicode in the source code for readability,
but already translating them into gdrascii at compile time.

After also implementing the control codes from the table, I could do the first prints.

<figure>
    <video width="400" controls>
        <source src="/vid/typewriter-printing.mp4" type="video/mp4">
        <source src="https://dl.dropboxusercontent.com/s/v0d8w7om65vewf4/typewriter-printing.mp4" type="video/mp4">
    </video>
    <figcaption>Printing Tux</figcaption>
</figure>

The second feature I wanted to support was keyboard input, since the typewriter supports a mode in which it sends keyboard input over the serial connection instead of printing it.
This was quite easily possible using the linux kernel uinput API. The only complication was, that the typewriter already sends ready made character codes, but the linux kernel expects to receive raw keypresses.

For the character "L", the Linux kernel expects "(ShiftL or ShiftR) + L", so this could just be translated back.

<figure>
    <video width="400" controls>
        <source src="/vid/typewriter-typing.mp4" type="video/mp4">
        <source src="https://dl.dropboxusercontent.com/s/pg31ewc2ahwa6sd/typewriter-typing.mp4" type="video/mp4">
    </video>
    <figcaption>Tooting from the typewriter</figcaption>
</figure>

After all of that was done, I ordered a proper connector, to make it easy to put everything back together after putting it into the drawer.

<figure>
    <img alt="Version 2.0 of the typewriter interface" src="/img/typewriter_interface_2_0.JPG" width="400">
    <figcaption>The final result, with a proper connector</figcaption>
</figure>
