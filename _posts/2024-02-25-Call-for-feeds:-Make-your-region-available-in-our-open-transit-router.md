---
layout: post
title:  "Call for feeds: Make your region available in our open transit router"
date:   2024-02-25 16:33:33+01:00
categories: kde
---

You may have already read about it on Volkers blog: we together with people from other public transport related projects are building a public transport routing service called Transitous.
While of course our main motivation is to use it in KDE Itinerary, KDE's travel planning app, it will be open for use in other apps.

We also have a little web interface running at [transitous.org](https://transitous.org/).

We are building this service based on great existing software, in particularly [MOTIS](https://motis-project.de).

{% include img.html width="1000px" alt="Screenshot of the Transitous web interface, showing the positions of long-distance transit vehicles in Germany, the Netherlands, Switzerland, Latvia, Estonia and Sweden" src="/img/transitous-web.png" %}

Now, to make this really useful, we need data on more regions.
Luckily, for most regions and countries that is fairly easy. Most transport agencies and countries make GTFS feeds available, that we can just use.

Adding an additional feed doesn't take long and doesn't need programming experience.
It's pretty much just creating a small text file that explains how and where to download the data from.

Those links don't necessarily stay the same forever, so we would be happy if lots of people take care of their region, and update the link every few years. It is really little work if split up, but can't all be handled by a small team.

To make it even easier, we can already use the Transitland Atlas feed collection, for which you just need to choose the feed to use. The url will then automatically be looked up.

You can find out how to add a feed [here](https://github.com/public-transport/transitous?tab=readme-ov-file#adding-a-region).
Please let us know if the documentation is unclear anywhere.

If you are interested in using this service in your own application, it is probably a bit too early for production, but it makes sense to already implement support for the MOTIS API that we use.
You can find an early version of our API documentation [here](https://routing.spline.de/doc/index.html).

If there is anything else you are interested in helping with, for example improving our ansible playbook, creating a website, improving MOTIS or working on integrating OpenStreetMap routing, you can find our open tasks [here](https://github.com/public-transport/transitous/issues). We appreciate any help on those issues, and it of course speeds up the development of the project.
