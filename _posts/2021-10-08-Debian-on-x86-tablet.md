---
layout: post
title:  "Debian on an x86_64 tablet"
date:   2021-10-08 02:03:00 +2:00
---

Recently I got an older Intel tablet, specifically the mpman Converter 102.
It is one of the devices that have a 64-bit processor but a 32-bit UEFI.
This makes booting normal linux distribution images impossible.
This device had another limitation, it didn't have a menu to boot from USB.

<figure>
    <img alt="The tablet and the Pine Phone" src="/img/x86-tablet.jpg" width="45%">
    <figcaption>Taking good pictures at 3 am is hard.</figcaption>
</figure>

Luckily this isn't a problem, since the refind boot manager can be installed from within Windows.
The author of refind maintains [good documentation on how to do that](https://rodsbooks.com/refind/installing.html#windows).

The refind that will be booted afterwards is still 32-bit, so normal distros will still not boot.
To work around that, we need an install media that contains a 32-bit grub build.
Since the default iso files from debian are a ISO 9660 filesystem, it's not trivial to add new files to the boot media.
While you can unpack the iso and repack it, I just used unetbootin and copied the file afterwards. Unetbootin leaves a fat32 filesystem instead of the ISO 9660 one.
The [32-bit grub](https://github.com/hirotakaster/baytail-bootia32.efi/blob/master/bootia32.efi) I used is unfortunately just a random file from GitHub. You may find better, more trustworthy builds of it, but this is what worked for me.
You can now boot the media from within refind, and you will see the debian grub menu, rendered in a very basic way because the grub build is old.

Finally the Debian installer can be ran as usually.
Unfortunately these kind of tablets can contain hardware that linux-firmware doessn't have firmware for, so it's likely that you have to find some of them on the internet. If you have the same tablet, I can give you the files I used. They are for a different tablet (One called jumper-ezpad-mini3), but turned out to work.

The uefi bootorder editing that the debian installer did didn't work for me, maybe because I installed on an external SD-card.
So I had to select refind in the UEFI menu after pressing ESC. Then I could launch the Grub which the Debian installer installed and boot the new system.

We can set up refind as the primary bootloader again using `efibootmngr`. `efibootmngr -o {list of numbers}` can be used to set the bootorder. The boot entry numbers can be retrieved by running `efibootmngr` without arguments.

So far the screen was always rotated to the right. Luckily with current linux kernels this can be easily changed.
For that, `/etc/default/grub` needs to be edited.
We need to find out the name of the internal display. This can be done using xrandr `xrandr --listmonitors`.
Then we can change `GRUB_CMDLINE_LINUX_DEFAULT` to `quiet splash video={display_name}:panel_orientation=right_side_up`.

I decided to hide grub as much as possible, since my primary bootloader is refind. Grub is still needed to cross the 32-bit / 64-bit boundary, but it can be hidden using the following lines:
```
GRUB_HIDDEN_TIMEOUT=0
GRUB_TIMEOUT=0
```

After all changes are done, we can run `update-grub` as root.

I wrote this down mostly for reference in the future, but maybe it can help you with a device of yours.

