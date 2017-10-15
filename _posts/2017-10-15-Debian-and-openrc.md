---
layout: post
title:  "Debian and OpenRC"
date:   2017-10-15 17:28:00 +2:00
categories: debian
--- 

Today I experimented with using the OpenRC initsystem in debian. I did all the steps in a virtual machine, but they should work on real hardware too.

After installing debian in the VM using a netinstall image of debian stretch, I could directly start converting the system to OpenRC. [This post](http://linuxmafia.com/kb/Debian/openrc-conversion.html) was very helpful for me. (Remind me to fix the Link color on this blog, "This post" is a link)

```
apt install openrc 
```

```
apt purge --auto-remove systemd
```

```
echo -e 'Package: systemd\nPin: origin ""\nPin-Priority: -1' > /etc/apt/preferences.d/systemd
echo -e '\n\nPackage: *systemd*\nPin: origin ""\nPin-Priority: -1' >> /etc/apt/preferences.d/systemd
```

Now your system should be configured to use the OpenRC initsystem and shouldn't install systemd anymore.
I also installed the rEFInd bootloader instead of grub, but both work fine and don't influence the initsystem.

When you try installing Plasma as your desktop environment, you will quickly get to the problem that policykit-1 and udisks2 depend on systemd, which we don't want to install in this case. The devuan project however has builds of this packages which don't depend on systemd, so we will add their sources to our debian stretch system.

To prevent your system from being converted to a devuan system, install `desktop-base` and `apt-mark hold desktop base` it.

Now add `deb http://packages.devuan.org/devuan ceres main` to your sources.list file.

After an `apt update` you can install the devuan versions of the two packages:
first, find out what the latest version of the package in devuan is:
```
apt-cache madison $package
```
In my case, it was `0.105-9+devuan1`, so I could use `apt install policykit-1=0.105-9+devuan1` and `apt-mark hold policykit-1`.
Do the same for udisks2 and all other packages that try to install systemd. 

In my case there weren't any other, but as soon if you install more software, you will get the problem again.

## Result

My result was a perfectly running sytem using this stack:

rEFInd > OpenRC > lightdm (kde-greeter) > plasma-desktop

The only reason why I wouldn't do this on my main machine yet is that holding and manually installing some packages from devuan is not the nicest thing to do when you just want to upgrade your system.
