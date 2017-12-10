---
layout: post
title:  "Introduction to debian packaging"
date:   2017-12-10 13:49:30 +1:00
categories: debian halium
---

In the last weeks I got the impression that many people think of debian packaging as as a sort of black magic. It may seem like it is, because it's sometimes hard to get started, but it's quite easy once you know a few basic commands.

First, setting up a few environment variables saves a lot of time later.
* `export EMAIL=""`
* `export NAME=""`

You can add this to your bashrc so both variables are automatically set.

If you haven't already, install some useful scripts:
`apt install devscripts build-essential`

Next, get a sourcecode tarball of the software you want to package. Rename the file to a `<package-name>_<version>.orig.tar.{xz/gz}`.
Unpack it into a new folder named `<package-name>-<version>`. Inside the new folder, run `dh_make`. If you have set the correct environment variables, your name and email will be detected correctly. Choose s (single) as package type, and follow the instructions.
When dh_make has finished, you can edit the files in the new debian/ folder. Don't worry about that so many files have been created. For a simple package you can delete everything else than
* control
* rules
* copyright
* source/format.

If you are lucky, a quick `dpkg-buildpackage` already generates a working deb package. However, you are still not finished. You need to insert all build dependencies into the control file, so that other people trying to build your package know what they need to install first. You can install the build dependencies from the control file by running `apt build-dep .`

In case your package doesn't build yet, you need to modify the rules file. It tells dpkg-buildpackage how to generate the binaries from the sourcecode. You can add your own build instructions by overring automatic targets.

Adding `dh_auto_configure:` allows you to add your own configure steps. A typical configuring step is e.g. `cmake .`
The same works for example with `dh_auto_build` for the building step. A typical building step is `make`.
Please don't override the targets if they worked automatically!

The runtime dendencies will most likely get detected automatically, only special things like QML modules still need to be inserted into the control file.
After editiing the copyright file, your package is ready to be published.

For all more advanced questions, the debian wiki has great articles. It's also very helpful to look at exisiting packages on [anonscm.debian.org/cgit](http://anonscm.debian.org/cgit)
