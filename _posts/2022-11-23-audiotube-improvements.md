---
layout: post
title:  "Recent AudioTube improvements"
date:   2022-11-25 00:48:00 +1:00
---

Since the last post about AudioTube, a lot has happened!
So in this blog post, you can find a summary of the important changes.

## Notable new features

### Library

AudioTube now has a library, in which you can see your favourite, most often and recently played songs.
![library with rounded covers](/img/audiotube/library.png){:width="500px"}
### Filtering through previous searches

This allows searching through locally known songs and previous search terms, without even sending a request to youtube.
![search dialogue which displays songs from your history](/img/audiotube/search.png){:width="500px"}
### Lyrics

While playing a song, you can now see the lyrics of the song in a separate tab.
![lyrics shown in the player](/img/audiotube/lyrics.png){:width="500px"}
## User Interface improvements

Finally, AudioTube displays album covers everywhere. Devin Lin has redesigned and improved the actual audio player.
Mathis Brüchert has done several design improvements across the board, like rounded album covers, improved spacing.

The support for wider screens has also been improved, and the queue list will now only expand up too 900 virtual pixels.
![player](/img/audiotube/player.png){:width="500px"}
## Fixes

Fetching thumbnails is now much faster, since in most cases the thumbnail ID can be reliably predicted, without querying yt-dlp.
In the few remaining cases, querying yt-dlp is still the fallback

## Install

If you want to try AudioTube, you can get the latest stable version from [flathub](https://flathub.org/apps/details/org.kde.audiotube).
If you want the latest improvements, which are usually already reasonably stable, you can grab a nightly build from the [KDE Nightly flatpak](https://community.kde.org/Guidelines_and_HOWTOs/Flatpak) repository.

## Code improvements

While developing the library feature, a small new library was developed. I called it FutureSQL, after the QFuture type it uses for most parts of its API.
FutureSQL provides an asynchronous API for QtSql, by running the database queries on a separate thread. It also provides convinient template functions for passing parameters to SQL queries.

Possibly the most interesting feature is automatically deserialize the resulting data from an SQL query into a struct.
This works thanks to C++ templates.

In the simplest cases, nothing but
```C++
struct Song {
	using ColumnTypes = std::tuple<QString, QString, QString, QString>;

	QString videoId;
	QString title;
	QString album;
	QString artist
}
```
is required.

The library version of this code does not yet have a stable release, however you can already try the API if you build the library [from the repository](https://invent.kde.org/jbbgameich/futuresql/).
