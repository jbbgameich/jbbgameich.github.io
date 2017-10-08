---
layout: post
title:  "Porting an Android device to Halium"
date:   2017-10-08 21:14:00 +2:00
categories: halium
---

The device I started to port is the BQ Aquaris U, codenamed chaozu.
Unfortunately, the device is not yet supported by LineageOS as an official device, but a device tree by aquaris-dev exists.
I won't repeat the whole porting guide here, so if you don't know Halium yet but want to fully understand this post, maybe consider reading the [porting guide](https://docs.halium.org)  before.
After extracting the proprietary blobs, pushing them to github and adding them to my local_manifest, I could start building. Like it's happening often with device-trees in connection with Halium, building did not directly work fine due to some java content in the device tree and the generated vendor tree. As Halium doesn't use java for the HAL, I needed to remove all references to apks and java files in the makefiles of my device and vendor tree.

Adapting the config script with the mer-kernel-checker went fine, as the kernel is quite new (for a phone, not for Linux in general, it's 3.18). Newer kernels always make less problems, while kernels older than 3.1 aren't even covered by the glibc build used in most distributions and also the Halium reference rootfs.

The first install directly did not work, due to the strange bugs in my TWRP image. Many other porters also experienced such bugs, and so I decided to rewrite the installer sccript to work around the bugs. In case the official one doesn't work on your device, my rewrite can be found [here](https://github.com/JBBgameich/halium-install). Thanks to johndoe / trivial_inanity /thewisenerd (or how he wants to be called), the scipt now also supports and setting up Plasma Mobile on top of Halium.

After flashing the hybris-recovery.img file, (hybris-boot.img did not work as expected) and connecting to the initrd via telnet, I could boot into the Ubuntu 16.04 reference rootfs and connect using ssh. The next steps I did was fixing the android container startup, which was quite easy. I forgot to set one option in the kernel configuration which wansn't covered by the mer-kernel-check script, but needed for LXC. After checking for the missing one by running lxc-checkconfig on the phone,the container started up correctly, which I could verify by running systemctl status lxc@android. The systemctl status command will also help you to find out if the container and the other services are all running correctly.

<video width="500" controls>
    <source src="/vid/halium-chaozu-blinking-led.webm" type="video/webm">
</video>
**The blinking Notification LED**

However most of the libhybris tests still fail, exept test_vibrator. I could also mix nice colours using my devices notification LED, by echo-ing into /sys/class/led/ virtual files of the kernel. This even worked when the container was still broken. I'll keep working on it over the next weeks and month, but I can only spend much time on it on the weekends. An other problem is that this is my only phone, and so I have to flash it back to android every time after working on the port. I hope to be a Plasma Mobile or UBports user soon, but let's see how far I come.

If there isn't anything interesting to tell, I won't write a new blog post on this too soon. If you want to know what happens, keep track of the porting issues (like [my one](https://github.com/Halium/projectmanagement/issues/21)
) or join us on Matrix (halium:matrix.org), irc (#halium on freenode) or [Telegram](https://t.me/halium).
