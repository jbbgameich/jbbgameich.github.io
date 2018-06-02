---
layout: post
title:  "Plasma Mobile on the bq Aquaris U"
date:   2018-06-02 16:04:21 +2:00
categories: halium plasma-mobile
---
 
After a nearly too long time of no new posts on this blog, I finally have something to write about again:
Plasma Mobile finally runs on my phone. I restarted the Halium portlwhich I already wrote about [here](/halium/2017/10/08/Porting-a-device-to-Halium.html)l nearly from scratch, based on the new device tree from LineageOS, which is now based on a common tree for all msm8937 bq devices. That means porting to the Aquaris U Plus and Light should be a lot easier now as well.
This devices all use caf firmware, so I needed to use the caf rootfs of Plasma Mobile.

But first, the screenshots you have probably been waiting for:

![The homescreen](/img/chaozu-plasma-mobile_2.jpg){:height="300"}
![quick settings](/img/chaozu-plasma-mobile_1.jpg){:height="300px"}
![Konsole](/img/chaozu-plasma-mobile_3.jpg){:height="300px"}
![chess](/img/chaozu-plasma-mobile_4.jpg){:height="300px"}


In case you own the same device and want to try it out, you can download the Halium images [here](https://archive.kaidan.im/halium/chaozu/). The Plasma Mobile images can be downloaded from the [official website](https://plasma-mobile.org/get). I hope the rootfs gets updated soon, so manual steps like [creating the udev rules](https://docs.halium.org/en/latest/porting/debug-build/index.html) are not neccesary anymore.

Unfortunately, a lot of things doesn't work in this port yet. The most important problem is that all QML apps are rendered incorrectly, which is what I'm going to solve as soon as I can. Audio is also not yet implemented in the port. Fortunately, the basics like wifi, touch and hardware acceleration do work very well. The shell reacts very smoothly on touch events, which  surprised me positively, since this is not the case on the other device (Xperia Z) I tried Plasma Mobile on.

I hope that this will allow me to contribute to the Plasma Mobile project more efficiently, since I can test on an actual device now. If you have a similar device and want to port it, feel free to reach out to me in the Plasma Mobile or Halium channels.
Another post will follow once QML apps like Kaidan work.
