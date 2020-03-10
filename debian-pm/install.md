---
layout: page
title: Installation
permalink: /debian-pm/install/
---

# Halium devices
First, download the following images:
 * [rootfs image](https://archive.kaidan.im/debian-pm/images/halium)
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

# Pinephone
Download the [system image for the pinephone device](https://archive.kaidan.im/debian-pm/images/pinephone/plasma-mobile/)
This image can directly be flashed to an SD-Card or EMMC chip.

To find out which kernel device was assigned to your SD-Card or EMMC, run `sudo fdisk -l` and look for the correct device.
Once you know the device, for example /dev/sdb, you can flash the image to it using dd.

```zcat debian-pinephone-plasma-mobile-testing-arm64.img.gz | sudo dd status=progress of=/dev/sdb```

The flashing will take a lot of time depending on the speed of your storage device.

# Workarounds
If the plasmashell crashes at the first startup, it will not try to place the proper widgets again (taskpanel etc.), as a result you will only see the homescreen after the next reboot, missing some parts.

To workaround this,
* pinephone: switch the headphone killswitch to off, and connect your headphone serial debugging cable. Then use picocom to connect `sudo picocom /dev/ttyUSB0 -b 115200`
* Halium devices: connect the USB cable and ssh into `phablet@10.15.19.82`.

You can then log in as `phablet` / `1234`.
Then run `rm ~/.config/plasma-org.kde.plasma.phone-appletsrc ~/.config/plasmashellrc`.
