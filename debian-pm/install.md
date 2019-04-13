---
layout: page
title: Installation
permalink: /debian-pm/install/
---
First, download the following images:
 * [rootfs image](https://archive.kaidan.im/debian-pm/images/)
 * [halium system image](https://archive.kaidan.im/halium/)
 * [halium hybris-boot image](https://archive.kaidan.im/halium/)

The last to images are specific to your device.
You can either build them yourself using the halium buildsystem,
or download a prebuilt one from [the server](https://archive.kaidan.im/halium/) if one is available for your device.

After downloading, you can install the halium system image and the rootfs.
For that you can use this [halium-install](https://github.com/JBBgameich/halium-install/releases) script.

Reboot your device into the TWRP recovery, and use

```halium-install -p debian-pm rootfs.tar.xz system.img```

 to install the images.
Please note that you need to use 

```halium-install -p debian-pm-caf rootfs.tar.xz system.img```

to install the images on caf (Qualcomm) devices.

The last step is flashing the hybris-boot.img, which is also a halium part.
Depending on the device, you can use fastboot or heimdal to do it.

On fastboot capable devices, it can be installed using
`fastboot flash boot hybris-boot.img`
