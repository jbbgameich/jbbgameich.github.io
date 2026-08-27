---
layout: post
title:  "Tickets in Transitous"
date:   2026-08-27 23:35:10+02:00
categories: kde
---

As you might already know, Transitous is a project that runs a public transport routing service that aims to work wold-wide.
To make Transitous results more useful, there needs to be a simple way to book the individual sections of a multi-modal route.
It is important to mention that Transitous can not legally sell tickets itself, and there are no plans to change that, so booking in this case means directing users to a ticket shop that can sell tickets for the route.

![LTG Link route from Vilnius to Kaunas displaying a "Tickets" button](/img/ticketing/vilnius-kaunas.png)

## Ticketing Extension

Transitous is primarily based around the GTFS format for its transport schedules, although NeTEx is increasingly being used as well.
The first step naturally was to implement reading ticketing information from the schedule files. Although ticketing is not a core part of GTFS, there is the [Google Transit ticketing extension](https://developers.google.com/transit/gtfs/reference/google-transit-ticketing-extension).

Its most important feature is specifying booking urls and a way to pass the stop ids, trip ids and times to the ticket shops.
The extension also allows to define ids for stops and trips that the ticket shop can understand. This is important because often the ticket shop software is different from the piece of software that writes the GTFS files. These don't necessarily have to agree on the identifier they use.

If each trip had it's own booking deeplink, the size of the schedule would increase massively, as well as the size of the data we'd need to store on the Transitous servers. To solve this, the ticketing extension only stores the base url, and assembles the parameters for each deep link only if needed.

However, this requires a separate shop-specific server side step to convert the standardized parameters to something that the ticket shop understands.

## My work

Transitous is mostly just an instance of the MOTIS routing engine, so much of the work happened [there](https://github.com/motis-project/motis/pull/1414).

This work has partially been funded by [NLnet](https://nlnet.nl/) through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund) with financial support from the European Commission's Next Generation Internet programme.

Unfortunately that did not magically give us booking links everywhere. The ticketing extension does not (yet) play such a big role in the open-data / open-source GTFS ecosystem. However since Google Maps supports it, many feeds made for it already contain `ticketing_deeplinks.txt`.
Maybe you can get your local transit operators to add support for it as well :)

To do my part in improving the situation, I added support for it in some of my own GTFS feeds and [the library I use for creating them](https://github.com/rust-transit/gtfs-structure/pull/186).

Since the problem of needing to translate the url parameters for the ticket shops comes up in every inofficial feed, I also wrote a [generic server](https://codeberg.org/transitous/transitous-ticket-redirect) for doing the redirecting. Adding support for a new ticket shop there is very easy.
Since I already host it, it also removes the burden of needing to run a server side component for each feed one publishes.

You can see the results on Transitous: [Route from Nikšić to Podgorica](https://api.transitous.org/?fromPlace=me-zpcg_25&toPlace=me-zpcg_8&withFares=true&numLegAlternatives=3&joinInterlinedLegs=false&noCompulsoryReservation=false&maxMatchingDistance=250&fromName=Nikšić%2C+Montenegro&toName=Podgorica%2C+Montenegro&fromPos=42.770466%2C18.944532&toPos=42.432007%2C19.269415#10.12/42.6015/18.9347).

## Adding Ticketing

Adding ticketing to your own feeds is fortunately quite straightforward in many cases. These examples are based on my `gtfs-generator` rust crate, but it would be very similar in other language ecosystems.

Assuming there is one shop for all trips in the feed, you only need to add one ticketing link:
```rust
generator
    .add_ticketing_deep_link(TicketingDeepLink {
        ticketing_deep_link_id: "tickets-zpcg".to_string(),
        web_url: Some("https://jbb.ghsq.de/ticket-redirect/zpcg/".to_string()),
        android_intent_url: Some("https://jbb.ghsq.de/ticket-redirect/zpcg/".to_string()),
        ios_universal_link_url: Some("https://jbb.ghsq.de/ticket-redirect/zpcg/".to_string()),
    }).unwrap();

```

If the IDs the ticket shop and the feed use are already the same, you already know the IDs and just need to copy them over:
```rust
generator.add_ticketing_identifier(TicketingIdentifier {
    ticketing_stop_id: stop.stop_id.to_string(),
    stop_id: stop.stop_id.to_string(),
    agency_id: "zpcg".to_string(),
})?;
```

Then all that's left is editing the agency entry to reference the new ticketing link.
For more complicated cases, you can also reference a different ticcketing link per route.

If the IDs don't match, chances are this is still relatively easy. Often the ticket shops' autocompletion allows to retrieve a full list of stops, ideally including coordinates as well. Then matching these to your stops is relatively straightforward.

If you import your feed into MOTIS with these changes, you should already get a clickable "Tickets"-button.
To make it redirect somewhere useful, the redirect server needs to be tought how the url scheme of the ticket shop works by adding a little function like this:

```go
func redirectZpcg(w http.ResponseWriter, r *http.Request, from []string, to []string, date []time.Time, trip []string, departure []time.Time, arrival []time.Time) {
	baseUrl, _ := url.Parse("https://www.tickets-zpcg.me/en/rezultati.php")
	q := baseUrl.Query()
	q.Set("from", from[0])
	q.Set("to", to[len(to)-1])
	q.Set("date", date[0].Format("2006-01-02"))
	baseUrl.RawQuery = q.Encode()

	http.Redirect(w, r, baseUrl.String(), http.StatusSeeOther)
}
```

The parameters are arrays, since in the ticket links allow to buy multiple tickets via one link. This feature might not be possible to support with every ticket shop.

Maybe this motivated you to add support for this in some new corner of the world :)
