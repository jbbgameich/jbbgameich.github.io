---
layout: post
title:  "Using kdesrc-build with a custom Qt"
date:   2019-05-25 13:30:12 +2:00
categories: misc
---

Although kdesrc-build supports building Qt5 just like the KDE Frameworks, I prefer to use the prebuilt Qt binaries from qt.io for testing against alpha and beta releases.
This saves me a lot of time on my machine, which is not powerful enough to compile the full Qt in a reasonable time.

This guide assumes that you already installed Qt from [qt.io/download-qt-installer](https://qt.io/download-qt-installer).

To reproduce my setup, an additional step is required compared to a kdesrc-build setup that uses the system Qt, nevertheless you start as usual, by cloning kdesrc-build itself:
```
git clone https://invent.kde.org/kde/kdesrc-build
```

Since kdesrc-build should be available anywhere on the system, not just in its own directory, we add it to the PATH variable by appending `export PATH=~/kde/src/kdesrc-build:$PATH` to your .profile file.
Please remember to adapt the path according to where you cloned kdesrc-build to.
```
echo "export PATH=~/kde/src/kdesrc-build:$PATH" >> ~/.profile
source ~/.profile
```

Next, the initial setup needs to be performed:
```
kdesrc-build --initial-setup
```

This step created all the required configuration files, which now need slight adaptions in order to work with the Qt we downloaded from qt.io in the beginning.

Edit `~/.kdesrc-buildrc`, and replace the path to Qt `qtdir` with the path you installed Qt to.
The line should then look similar to this:
```
    qtdir  ~/.local/Qt/5.13.0/gcc_64 # Where to find Qt5
```

Now as a final step we need to prevent kdesrc-build from trying to build its own Qt, which can be done by commenting one include line:
`include /home/jbb/kde/kdesrc-build/qt5-build-include`, so it looks like `#include /home/jbb/kde/kdesrc-build/qt5-build-include`.

This should be it! Have fun compiling up to date KDE software using an up to date Qt without compiling Qt for hours :)

```
kdesrc-build kirigami --include-dependencies
```

To activate your newly created environment, you can use
```
source ~/.config/kde-env-master.sh
```
