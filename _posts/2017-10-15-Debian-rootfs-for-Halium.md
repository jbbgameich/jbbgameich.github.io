---
layout: post
title:  "Debian rootfs for Halium"
date:   2017-10-24 17:02:00 +2:00
categories: debian halium
---

```
       _,met$$$$$gg.          root@chaozu
    ,g$$$$$$$$$$$$$$$P.       -----------
  ,g$$P"     """Y$$.".        OS: Debian GNU/Linux buster/sid armv7l
 ,$$P'              `$$$.     Host: Qualcomm Technologies, Inc. MSM8937-PMI8950 QRD SKU1 DVT1
',$$P       ,ggs.     `$$b:   Kernel: 3.18.31-perf-g680cc1490f5
`d$$'     ,$P"'   .    $$$    Uptime: 6 mins
 $$P      d$'     ,    $$P    Packages: 371
 $$:      $$.   -    ,d$$'    Shell: bash 4.4.12
 $$;      Y$b._   _,d$P'      Terminal: /dev/pts/2
 Y$$.    `.`"Y$$$$P"'         CPU: Qualcomm MSM8937 (8) @ 1.401GHz
 `$$b      "-.__              Memory: 70MiB / 1855MiB
  `Y$$
   `Y$$.
     `$$b.
       `Y$$b.
          `"Y$b._
```

You may have already guessed the news from the title: The debian rootfs for Halium is now finally working!
After a few month of no or only little improvements, I finally found the time to fix the last bug of the tethering script not working. This was caused by the deprecation of net-tools in debian, which the script depends on. Unfortunately ssh access to the device is not working without this script, so it really was a blocker. Currently net-tools is installed in the rootfs again, but I'm looking into porting the script to the ip command soon.

You can build the rootfs yourself using the rootfs-builder from here: [github.com/debian-pm/rootfs-builder](https://github.com/debian-pm/rootfs-builder), or use a prebuilt one from [here](https://archive.org/download/halium-debian-rootfs/halium-debian-rootfs_20171024.tar.gz).

Like the other rootfs for Halium, you can install it using the usual halium-install script from [here](https://github.com/halium/halium-scripts), or with my [own script](https://github.com/JBBgameich/halium-install).

The rootfs can be used as an alternative to the ubuntu reference rootfs, but the best usecase is probably extending the rootfs with a GUI (like Plasma Mobile). I did already work on that, and the packaging for Plasma Mobile can also be found in the [github organization](https://github.com/debian-pm).

Currently the rootfs has a few packages installed that are required for Halium, but not (yet?) included into debian.

* libhybris
* android-headers
* lxc-android
* ofono (with ofono-scripts)

If you know if there's any chance for this packages to get accepted into debian, please notify me in the Halium room and we can work on that.
All of this packages are fully open-source and do not redistribute any binary blobs.
