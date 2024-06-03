---
layout: post
title:  "Recent side projects"
date:   2024-06-03 13:55:02+02:00
categories: kde
---

In addition to my larger projects in KDE and elsewhere,
I've been working on a number of small projects over the years.

Since these naturally are hard to find, I want to present each one here briefly.
Maybe you'll find some of them useful.

## MatePay

[MatePay](https://gitlab.spline.de/spline/matepay/matep) is a small payment system developed for the student hackerspace I'm part of, Spline.

It has a small built-in shop that we have been mostly using for the beverages that we provide in the space.
However it also features an API that applications can use to process payments with. We use that to run public printers in the University.

MatePay is based on a simple SQLite database, it only makes sense to use when trusting the party hosting it.

{% include img.html width="600px" alt="Screenshot of the MatePay start page, showing the options to buy something, publish products or send money" src="/img/side_projects/matepay.png" %}

## Mateprint

[Mateprint](https://gitlab.spline.de/spline/mateprint/mateprint) is a printing web interface with a payment feature.
It can also print multiple copies and double-sided pages.

It is just a simple static executable written in Rust.
All the hard work is done by CUPS.

{% include img.html width="600px" alt="The web interface of Mateprint, with the option to upload PDFs to print" src="/img/side_projects/mateprint.png" %}

## Rawqueued

Originally the public printers were all connected over the network, using HP network add-on cards.
Unfortunately just like the printers these are becoming really old (~30 years), and started dying regularly lately.

Since for some reason these cards are expensive I instead decided to replace them with Raspberry Pis. I wrote a small IPP server that just forwards the payload it receives to the printer, which is pretty much what the network cards did as well.

This setup is a bit simpler than maintaining cups filters on multiple devices, so the more complicated parts can all run on a central virtual machine.

You can find the repository [here](https://gitlab.spline.de/spline/mateprint/rawqueued).

## Wasfaehrt

{% include img.html width="600px" alt="Departure board showing busses in Dahlem" src="/img/side_projects/wasfaehrt.jpg" %}

In the University we have a departure board in one of the student managed rooms.
It is powered by the same code that also powers KDE Itinerary (KPublicTransport).

You can find it [on Codeberg](https://codeberg.org/jbb/wasfaehrt).

{% include img.html width="600px" alt="Departure board showing busses in Dahlem" src="/img/side_projects/wasfaehrt_rl.jpg" %}

## SpaceAPI

For the Spline room, we of course needed a [SpaceAPI](https://spaceapi.io/) endpoint.
There is a [small server](https://gitlab.spline.inf.fu-berlin.de/spline/windows/spacedoor) that provides the SpaceAPI endpoint and an API to update whether the door is open or not.
The updates are sent by a [daemon running on a Raspberry Pi](https://gitlab.spline.inf.fu-berlin.de/spline/windows/splined).
