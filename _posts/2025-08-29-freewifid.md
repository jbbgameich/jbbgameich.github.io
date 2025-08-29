---
layout: post
title:  "Improving the experience with public Wi-Fi hotspots"
date:   2025-08-29 12:05:07+02:00
categories: kde
---

When travelling, I tend to rely on public Wi-Fi hotspots a lot, for example on trains, while waiting at the station, in cafe's and so on.

Accepting the same terms and conditions every time gets annoying pretty quickly, so a few years ago I decided to automate this. The project that came out of that is freewifid.

It continously scans for Wi-Fi networks it knows, and sends you a notification when it found one it can automatically connect to. You can then allow it to connect to that network automatically in the future.

![A freewifid notification asking wether to connect to a known network](/img/freewifid/notification.png)


## Adding support for new captive portals

Adding support for a new kind of captive portal is pretty easy. You just need to implement a small rust trait that includes a function that sends the specific request for the captive portal. Often this is very simple and looks like this:

```rust
pub struct LtgLinkProvider {}

impl LtgLinkProvider {
    pub fn new() -> LtgLinkProvider { LtgLinkProvider {} }
}

impl CaptivePortal for LtgLinkProvider {
    fn can_handle(&self, ssid: &str) -> bool {
        ["Link WIFI"].contains(&ssid)
    }

    fn login(&self, http_client: &ureq::Agent) -> anyhow::Result<()> {
        common::follow_automatic_redirect(http_client)?;

        http_client
            .post("http://192.168.1.100:8880/guest/s/default/login")
            .send_form([
                ("checkbox", "on"),
                ("landing_url", crate::GENERIC_CHECK_URL),
                ("accept", "PRISIJUNGTI"),
            ])?;

        Ok(())
    }
}
```

For finding out what needs to be sent, you can use your favoute browser's inspection tools.

For testing, Plasma's feature for assigning a random MAC-address comes very handy.

## Integration with Plasma

It could be interesting to write a KCM for freewifid, so you can graphically remove networks again.
Support for ignoring public networks in the presence of a given SSID is also already implemented, but currently needs to be enabled by editing the config file.
Writing a KCM is not high on my list of priorities right now, but if this sounds like something you'd like to do, I'd happily help with with the freewifid interfacing parts.

## Project

The project is [hosted on Codeberg](https://codeberg.org/jbb/freewifid).
I'll happily accept merge requests for additional captive portals there.

There are some prebuilt release binaries, but I'm not too certain they'll work on every distribution.
With a rust compiler installed, the project is very simple to build (`cargo build`).
A systemd unit is provided in the repository, which you can use to run freewifid as a user unit.

Freewifid also supports running as a system service non-interactively for use in embedded projects.
