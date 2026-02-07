---
layout: post
title:  "Generating GTFS Feeds"
date:   2026-02-07 23:47:14+01:00
categories: kde
---

Transitous is a project that runs a public transport routing service that aspires to work wold-wide.
The biggest leaps forward in coverage happened in the beginning, when it was just a matter of finding the right urls to download the schedules from. Most operators provide them in the GTFS format, which is also used in Google Transit and a few other apps.

However, the number of readily available GFTFS schedules (so called feeds) that we are not using yet is starting to become quite small.
As evident when comparing with Google Transit, there are still a number of feeds that are only privately shared with Google. This is not great from a standpoint of preventing monopolies and also a major problem for free and open-source projects which don't have the resources to discuss with each operator individually or to even buy access to the data from them.
Beyond that case, there is still a suprisingly large number of places in the world that do not publish any schedules in a standardized format, and that is something that we can fix.

Source data comes in many shapes and forms, but the ingredients we'll definitely need are:
 * the lines
 * stop times
 * stop locations
 * and service dates

Sometimes you can find a provider specific API that returns the needed information, or there is open data in a non-standard format.
In the worst case, it might be necessary to scrape data out of the HTML of the website.
 
Some examples:

a stop time from the API of ŽPCG (Railway in Montenegro):

**Example 1**:
```json
{
    "ArrivalTime" : "15:49:16",
    "DepartureTime" : "15:51:16",
    "stop" : {
        "Latitude" : 42.511829,
        "Longitude" : 19.203468,
        "Name_en" : "Spuž",
        "external_country_id" : 62,
        "external_stop_id" : 31111,
        "local" : 1,
    }
}
```

It is immidiately visible that we get the stop times, in for some reason extreme precision.
We also get coordinates for the location, which makes conversion to GTFS much easier. Unfortunately the coordinates from this dataset are not exactly great, and can easily be off by multiple kilometers, but they nevertheless provide a rough estimate that we can improve on by matching them to OpenStreetMap.

The railway-data enthusiasts will also notice that we get a UIC country code and a stop code, which we can concatinate to get a full UIC stop identifier. We can make use of that for OSM matching later on.

**Example 2**:
```xml
<ElementTrasa Ajustari="0" CodStaDest="27888" CodStaOrigine="23428" DenStaDestinatie="Ram. Budieni"
    DenStaOrigine="Târgu Jiu" Km="1207" Lungime="250" OraP="45180" OraS="45300" Rci="R" Rco="R" Restrictie="0"
    Secventa="1" StationareSecunde="0" TipOprire="N" Tonaj="500" VitezaLivret="80"/>
```

This example is from open data for railways in Romania. Unfortunately this one does not give us coordinates, and the fact that the fields are in abbreviated Romanian doesn't make it too easy to understand for someone like me who does not speak any vaguely related language. However looking at the numbers, we can figure out that `OraP` and `OraS` are seconds and provide the departure and arrival times. However here, the data does not model the times at stops, but the transitions between the stops, so some more reshuffling is necessary.

**Example 3**:
```json
{
    "ArrivalTimes" : "12:35, 13:37, 14:02, 14:21, 14:52, 14:27, 15:04, 15:50, 16:14, 16:39, 17:08, 17:36, 18:55, 19:03, 19:12, 20:05, 20:33, 21:12, 21:47",
    "Classes" : "2",
    "DepartureTimes" : "12:35, 13:38, 14:03, 14:22, 15:12, 14:42, 15:29, 15:51, 16:15, 16:40, 17:33, 17:37, 18:57, 19:08, 19:13, 20:06, 20:34, 21:13, 21:47",
    "Route" : "Vilnius-Krokuva",
    "RouteStops" : "Vilnius, Kaunas, Kazlų Rūda, Marijampolė, Mockava, Trakiškė/Trakiszki, Suvalkai/Suwałki, Augustavas/Augustów, Dambrava/Dąbrowa Białostocka, Sokulka/Sokółka, Balstogė/Białystok, Balstogė (Žaliakalnio stotis) / Białystok Zielone Wzgórza, Varšuva (Rytinė stotis)/ Warszawa Wschodnia, Varšuva (Centrinė stotis)/ Warszawa Centralna, Varšuva (Vakarinė stotis)/ Warszawa Zachodnia, Opočnas (Pietinė stotis)/Opoczno Południe, Vloščova (Šiaurinė stotis)/Włoszczowa Północ, Mechuvas/Miechów, Krokuva (Pagrindinė stotis)/ Kraków Główny",
    "RunWeekdays" : "1,2,3,4,5,6,7",
    "Spaces" : "WHEELCHAIR, BICYCLE",
    "TrainNumber" : "33/141"
}
```

This example is from the, to my knowledge, only source of semi-machine-readable information on railway timetables in Lithuania.
While json is straightforward to parse, this one for some reason does not use json arrays, but comma-separated lists. We can still work with this of course, until a stop appears whose name contains a comma. Oh well. Once again, no coordinates are provided. While it is tempting to think this should be easier to convert than xml in Romanian, this format has some more hidden fun.
If you have been to the area the line from the example operates in, you might already have noticed that the time zone changes between Lithuania and Poland. Unfortunately, there is no notice of that in the data, just a randomly backwards-jumping arrival and departure time.

To work with this, we first need to match the stop names to coordinates, then figure out the time zones from that, and then convert the stop times.

## Matching stations to locations

OpenStreetMap is the obvious choice for this. It is fairly easy to query the station locations, but matching the strings to the node in OSM is not trivial.
There are often variations in spelling, particularly if the data covers neighbouring countries with different languages. The data may also have latinized names, while the country usually uses a different script and so on.

Since this problem comes up repeatedly, I am slowly improving my rust library (`gtfs-generator`) for this, so it can hopefully handle most of these cases automatically at some point.
It aims to be very customizable, so the matching criteria needs to be supplied by the library user.
The following example matches a stop if it has a matching uic_ref tag, which is a strong identifier.
If no node has such a matching tag, all nodes in the radius of 20km are considered, if their name is either a direct match, an abbreviation of the other spelling, similar enough or has matching words.
The matching radius can be overridden in each query, so if nothing is known yet, the first guess can be the middle of the country with a large enough radius.
As soon as one station is known, the ones appearing on the same route must be fairly close.
The matching quality strongly depends on making a good guess of the distance from the previous stop, as it greatly reduces the risk of similarly named stations being mismatched.

Since OpenStreetMap provides different multi-lingual name tags, the order that these should be considered in needs to be set as well.

The code for matching will look something like this:
```rust
let mut matcher = osm::StationMatcherBuilder::new()
    .match_on(osm::MatchRule::FirstMatch(vec![
        osm::MatchRule::CustomTag {
            name: "uic_ref".to_string(),
        },
        osm::MatchRule::Both(
            Box::from(osm::MatchRule::Position {
                max_distance_m_default: 20000,
            }),
            Box::from(osm::MatchRule::FirstMatch(vec![
                osm::MatchRule::Name,
                osm::MatchRule::NameAbbreviation,
                osm::MatchRule::NameSimilar {
                    min_similarity: 0.8,
                },
                osm::MatchRule::NameSubstring,
            ])),
        ),
    ]))
    .name_tag_precedence(
        [
            "name",
            "name:ro",
            "short_name",
            "name:en",
            "alt_name",
            "alt_name:ro",
            "int_name",
        ]
        .into_iter()
        .map(ToString::to_string)
        .collect(),
    )
    .transliteration_lang(TransliterationLanguage::Bg)
    .download_stations(&["RO", "HU", "BG", "MD"])
    .unwrap();
    
    // Parse input

    let station = matcher.find_matching_station(&osm::StationFacts {
        name: Some(name),
        pos: Some(previous_coordinates.unwrap_or((46.13, 24.81))), // If we know nothing yet, bias to the middle of Romania, so we at least don't end up in the wrong country
        max_distance_m: match (previous_coordinates, previous_time, atime) {
            // We have previous coordinates, but nothing for this station. Base limit on max reachable distance at reasonable speed
            (Some(_prev_coords), Some(departure), Some(arrival)) => {
                let travel_seconds = arrival - departure;
                Some(travel_seconds * 70) // m/s
            }
            // No previous location known
            _ => Some(800000),
        },
        values: HashMap::from_iter([("uic_ref".to_string(), uic_ref.clone())]),
    });
```

For now, until I'm somewhat certain about the API, you'll need to use the [git repository](https://codeberg.org/jbb/gtfs-generator) directly to use the OSM matching feature.

## Finally writing the GTFS file

After all the ingredients are collected, the actual GTFS conversion should be fairly easy.
We now need to sort the data we collected into the main categories of objects represented by GTFS, routes, trips, stops, and stop_times.

Every trip needs to have a corresponding route. The exact distinction between different routes depends on the specific transit system.
In the simplest case, if multiple buses operate with the same line number on the same day, they would belong to the same route.
Each time the bus operates per day, a new GTFS trip starts.

If the system does not have the concept of routes, every trip simply is its own route. This is for example what Deutsche Bahn does for ICE trains, where each journey has it's own train number.

The code for building the GTFS data looks somewhat like this:

```rust
    let mut gtfs = GtfsGenerator::new();

    // parse input

    gtfs.add_stop(gtfs_structures::Stop {
        id: stop_time.station_code.to_string(),
        name: Some(stop_time.station_name.to_string()),
        latitude: coordinates.as_ref().map(|(lat, _)| *lat),
        longitude: coordinates.as_ref().map(|(_, lon)| *lon),
        ..Default::default()
    })
    .unwrap();

    gtfs.add_stop_time(gtfs_structures::RawStopTime {
        trip_id: trip_id.clone(),
        arrival_time: Some(atime.unwrap_or(dtime)),
        departure_time: Some(dtime),
        stop_id: stop_time.station_code.to_string(),
        stop_sequence: stop_time.sequence,
        ..Default::default()
    })
    .unwrap();
    
    gtfs.write_to("out.gtfs.zip").unwrap();
```

## Validating the result

A new GTFS feed is rarely perfect on the first try. I recommend running it through [gtfsclean](https://github.com/public-transport/gtfsclean) first.
After all obvious issues are fixed (missing fields, broken references), you can use the [validator of the French government](https://transport.data.gouv.fr/validation?type=gtfs&selected_subtile=gtfs&selected_tile=public-transit) and the [canonical GTFS validator](https://gtfs-validator.mobilitydata.org/).
It is worth using both, as they for slightly different issues.

Ones all critical errors reported by the validators are fixed, you can finally test the result in MOTIS. You can get a precompiled static binary from [GitHub Releases](https://github.com/motis-project/motis/).
Afterwards create a minimal config file using `./motis config out.gtfs.zip`.
The API on it's own is not too useful for testing, so add 

```yaml
server:
  web_folder: /path/to/ui/directory
```

to the top of the file to make the web interface available.

Make sure to also enable the `geocoding` option, so you can search for stops.

Now all that's needed is loading the data and starting the server:
```bash
./motis import
./motis server
```

You should now be able to search for your stops and find routes:

{% include img.html width="800px" alt="MOTIS showing a connection between Vilnius and Riga" src="/img/gtfs/motis.png" %}

## Publishing

Once it is ready, the GTFS feed needs to be uploaded to a location that provides a stable url even if the feed is updated. The webserver should also support the `Last-Modified`-header, so the feed can be downloaded only when needed. A simple webserver serving a directory like nginx or apache works well here, but something like Nextcloud works equally well if you already have access to an instance of it.

Since the converted dataset needs to be regularly updated, I recommend setting up a CI pipeline for that purpose. The free CI offered by gitlab.com and GitHub is usually good enough for that.
I recommend setting up [pfaedle](https://github.com/ad-freiburg/pfaedle) in the pipeline, to automatically add the exact path the vehicles take based on routing on OpenStreetMap data.

Once you have a URL, you can [add it to Transitous](https://transitous.org/doc/#static-feeds-timetable) and places where other developers can find it, like the [Mobility Database](https://gtfs-validator.mobilitydata.org/)

If you are interested in some examples of datasets generated this way, check out the Mobility Database entries for [LTG Link](https://mobilitydatabase.org/feeds/gtfs/mdb-2991) and [ŽPCG](https://mobilitydatabase.org/feeds/gtfs/mdb-2377).
You can find a list with some examples of feeds I generate [here](https://jbb.ghsq.de/gtfs-feeds/), including the generator source code based on the `gtfs-generator`.

You can always ask in the [Transitous Matrix channel](https://riot.spline.de/#/room/#transitous:matrix.spline.de) in case you hit any roadblocks with your own GTFS-converter projects.
