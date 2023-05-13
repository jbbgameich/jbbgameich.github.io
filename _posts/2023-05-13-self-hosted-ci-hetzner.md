---
layout: post
title:  "Woodpecker CI with automatic runner creation"
date:   Sun May 14 01:30:53 CEST 2023
---

I've been happily using Woodpecker CI to get CI for my repositories on Codeberg.
Codeberg is a non-profit community-driven git repository hosting platform, so they can't provide free CI to everyone.

Since I run lots of stuff on small arm boards (for example this website), I need my CI jobs to create arm executables.
The easiest way to get that done is to just compile on arm devices, so I was happy to see that Hetzner is now offering arm nodes in their cloud offering.

To make that as cheap as possible, the CI should ideally create a VM before running its job, and remove it again afterwards.
Unfortunately Woodpecker does not seem to support that out of the box at this point.

My solution to that was to build a docker proxy, that creates VMs using docker-machine, and then proxies the incoming requests to the remote VM. That works really well now, so maybe you will find it useful.

Setting that up is reasonably simple:
* Install docker-machine. I recommend using the [fork by GitLab](https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/index.html)
* Install the backend for your cloud provider. For Hetzner I use [this one](https://github.com/JonasProgrammer/docker-machine-driver-hetzner)
* [Grab a binary release of docker-proxy](https://codeberg.org/jbb/docker-proxy/releases/tag/v0.1.0) (if you need arm executables), or compile it yourself.
* Create a systemd unit to start the service on boot in `/etc/systemd/system/docker.proxy.service`.
This particular one just runs it on the `woodpecker-agent` user that you may already have if you use Woodpecker CI.

```toml
[Unit]
Description=Docker CI proxy
After=network.target

[Service]
User=woodpecker-agent
Group=nogroup
Restart=always
ExecStart=/usr/local/bin/docker-proxy

[Install]
WantedBy=multi-user.target
```

* Fill in `/etc/docker-proxy/config.toml`
This example works for Hetzner, but everything that has a docker-machine provider should work. You just need to supply the arguments for the correct backend.

```toml
[docker_machine]
driver="hetzner"
args=[
    "--hetzner-api-token=<token>",
    "--hetzner-server-type=cax11",
    "--hetzner-image-id=103907373",
]

[general]
timeout=300
port=8000
```
* Finally, make `woodpecker-agent` use the new docker proxy, by setting `DOCKER_HOST=http://localhost:8000` in its environment.

I hope this may be useful for you as well :)
