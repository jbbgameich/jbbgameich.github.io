---
layout: default
title: Debian PM
permalink: /debian-pm/
---

<div class="w3-center">
	<h1>Debian PM<img height="150" class="w3-margin" src="{{ "/img/debian_pm_logo.svg" | prepend: site.baseurl }}" /></h1>
</div>

<div class="w3-container" markdown="1">

### Plasma Mobile for Debian
Debian PM is packaging Plasma Mobile for Debian.

The repository contains Plasma Mobile, various mobile apps and Qt built for OpenGL ES devices.

<a class="w3-margin-right w3-button w3-white w3-border" href="{{ "/debian-pm/screenshots/" | prepend: site.baseurl }}">View screenshots</a>
<a class="w3-margin-right w3-button w3-white w3-border" href="https://gitlab.com/debian-pm">Source code on GitLab</a>

### How to use this repository

The packages are intended to be used on a Debian testing base.

The repository is signed. The key can be automatically updated, because it's also a package in the repository. For the first-time install, you need to download and install the package manually, afterwards it will be updated using apt. Installing the key this way is reasonably secure, thanks to HTTPS.
<div class="w3-code notranslate">
	wget https://jbb.ghsq.de/debpm/pool/main/d/debian-pm-repository/debian-pm-archive-keyring_20210819_all.deb
</div>
<code class="w3-code notranslate">
	sudo dpkg -i debian-pm-archive-keyring_20210819_all.deb
</code>
Afterwards, add the following text to `/etc/apt/sources.list.d/debian-pm.list`.

<code class="w3-code notranslate">
	# Faster mirror<br>
	deb https://debpm.kryptons.eu/debpm testing main<br>
	# Upstream repository<br>
	deb https://jbb.ghsq.de/debpm testing main
</code>

After the next `sudo apt update` you can install packages from the repository.

<!-- If your device only supports OpenGL ES, like the Pine Phone does, you may want to install the `debian-pm-repository` package, which configures apt to always install Qt from the debian-pm repository, instead of installing from debian -->

### Install the base packages of Plasma Mobile

<div class="w3-panel w3-pale-yellow w3-border">
	<h4>If you are installing on Mobian…</h4>
	<p>The default graphical environment on Mobian is Phosh, which you will need to disable in order to run Plasma Mobile. You don't need to uninstall it though, so it can be easily enabled back later.</p>
	<code class="w3-code notranslate">
		sudo systemctl disable phosh
	</code>
</div>

The packages required for a minimal Plasma Mobile experience can be installed using the following command:
<code class="w3-code notranslate">
	sudo apt install plasma-mobile plasma-settings plasma-phonebook plasma-angelfish plasma-nm simplelogin plasma-dialer spacebar
</code>

<div class="w3-panel w3-pale-yellow w3-border" markdown="1">
By default, simplelogin assumes it should automatically log into the `phablet` user.
If your user account is called differently, you need to configure the correct username.
To change the username, run `systemctl edit simplelogin.service` and type the following where the comments instruct you:
	<code class="w3-code notranslate">
		[Service]<br>
		ExecStart=<br>
		ExecStart=/usr/bin/simplelogin --user mobian --session /usr/share/wayland-sessions/plasma-mobile.desktop
	</code>
The first `ExecStart` have to be empty, to reset the `ExecStart` line from the original service file.
The second `ExecStart` line is copied from the comment block, where the content of the original service file can be found.
After copying, this line has to be modified, to contain the right username.
On Mobian, the default user is `mobian`.
</div>

More apps can be installed from the repository.
<code class="w3-code notranslate">
        sudo apt install koko elisa qmlkonsole kalk kasts index alligator kaidan audiotube kweather kclock
</code>

</div>
