---
layout: post
title:  "AudioTube, a client for YouTube Music"
date:   2021-03-13
categories: kde
---

Recently I started working on a small new project, AudioTube.
It is a client for YouTube Music made with Kirigami that works equally well on mobile devices and desktops.

![AudioTube on a desktop](/img/audiotube_desktop.png)

Many of us use streaming services nowadays to find new music.
For those of us who are using a Pine Phone, there are no official apps for this purpose available.
AudioTube is supposed to bridge that gap.

{::nomarkdown}
<img height=500px class="post-img-right" alt="AudioTube showing an automatic playlist on my Pine Phone" src="/img/audiotube_mobile_playlist.png">
{:/}

I chose YouTube Music as the provider, because it has a large collection that can be used without a paid account.
The quality is good enough, and the client library situation is also good.
For everything but the playback, AudioTube uses a python library called [ytmusicapi](https://ytmusicapi.readthedocs.io/en/latest/reference.html),
and for finding the streaming urls, it makes use of the popular youtube-dl.

Right now, AudioTube can search YouTube Music, list albums and artists, play automatically generated playlists, albums and allows to put your own playlist together.

{::nomarkdown}
<img height=500px class="post-img-left" alt="The album view on mobile" src="/img/audiotube_mobile.png">
{:/}

ytmusicapi allows for more, there are a few more methods that could be used for e.g automatic artist mixes.

If you want to try it out, you can find the [code on KDE's GitLab, invent](https://invent.kde.org/jbbgameich/audiotube).
In addition to the common dependencies of Qt and Kirigami, it requires the ytmusicapi and youtube_dl python packages, which you can install using pip if they are not packaged in your distro.

Keep in mind AudioTube is still in an early state of development. Next I will look into implementing better error handling.
Of course I am always happy about merge requests :)

So far there is one known issue left:
On Manjaro, Python always tries to encode / decode as ascii, which makes the app crash with some data. I can't say yet whether it affects other distros too, but it doesn't happen on my debian testing install.
As a workaround, setting `LC_ALL=en_US.utf8` helps.
