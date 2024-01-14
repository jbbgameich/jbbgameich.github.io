---
layout: post
title:  "New countries in KDE Itinerary"
date:   Sun Jan 14 1:12:00 CET 2024
---

### Lithuania and Latvia

Caused by a small discussion about how it is difficult to get from Berlin to Riga by train,
and in direct consequence a quick look at how the official app for trains in Latvia finds its connections, I added support for it in KDE Itinerary.
KDE Itinerary is KDE's travel planning app.

After I understood how it works, adding support for new data sources seemed pretty doable, so I directly moved on to do the same for trains in Lithuania as well.

As a result of this, it is now possible to travel from Berlin to Riga with Itinerary and continue further with the local trains there:
<img width="250px" style="float: right;  padding: 10px" alt="Screenshot of the first part of the journey from Berlin Hauptbahnhof to Warszawa Gdanska using EC 249, and the next day continuing with IC 144 to Vilnius" src="/img/itinerary/part1.png">
<img width="250px" style="float: right; padding: 10px" alt="Screenshot of the second part, from Vilnius to Riga on the following day. Afterwards a local train to Sloka follows" src="/img/itinerary/part2.png">

The connection is still far from good, but fear I can't fix that in software.

What still does not work, is directly searching from Berlin to Riga, as that depends on having a single data source that has data on the entire route to find it.
So it is necessary to split the route and search for the parts yourself.

### Why you can't always find a route even though there is one

The main data source for Itinerary in Europe is the API of the "Deutsche Bahn", the main railway operator in Germany.
Its API also has data for neighbouring countries, and even beyond that.
[According to Jon Worth](https://jonworth.eu/how-to-actually-build-europe-wide-multimodal-public-transport-booking-platforms/) their data comes from UIC Merits, which is a common system that railway operators can submit their routes to.
However that probably comes with high costs, so many smaller operators like the ones in Latvia and Lithuania don't do that.
For that reason there is no such single data source that can route for example from Berlin to Riga.

What most of the operators in Europe do however, is publish schedule data in a common format (GTFS).
What is missing so far, is a single service that can route on all of the available data and has an API that we can use.
Setting something like this up would require a bit of community and hosting resources, but I am hopeful that we can have something like this in the future.

In the meantime, it already helps to fill in the missing countries one by one, so at least local users can already find their routes in Itinerary, and for Interrail and other cross border travel, people can at least patch routes together.

### More countries
The next country I worked on was Montenegro. The reason for that is that it is close to the area that the DB API can still give results for, and also still has useful train services.
Getting their API to work well was a bit more difficult though, as it doesn't provide some of the information that Itinerary usually depends on.
For example coordinates for stations. Those are needed to select where to search for trains going from a station.
Luckily, exporting the list of stations and their coordinates from OpenStreetMap was relatively easy and provided me with all the data I needed.

<img width="250px" style="float: right; padding: 10px" alt="A route from Belgrade Center to Podgorica, shown on a map by KDE Itinerary" src="/img/itinerary/montenegro.png">

Thanks to that Itinerary can now even show the route on a map properly.

Now only the API for Serbia is missing to actually connect to the part of the network DB knows about.

The new backends are not yet included in any release, but you can already find them in the nightly builds.
Be aware that the nightly builds have switched to Qt6 and KF6 faily recently, which means there are still a few rough edges and small bugs in the UI.

On Linux, you can use the nightly flatpak:
```
flatpak install https://cdn.kde.org/flatpak/itinerary-nightly/org.kde.itinerary.flatpakref
```

On Android, the usual [KDE Nightly F-Droid repository](https://community.kde.org/Android/F-Droid#KDE_F-Droid_Nightly_Build_Repository) has up to date builds.
