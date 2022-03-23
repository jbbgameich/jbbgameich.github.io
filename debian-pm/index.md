---
layout: default
title: Debian PM
permalink: /debian-pm/
---

<div class="w3-center">
	<h1>Debian PM<img height="150" class="w3-margin" src="{{ "/img/debian_pm_logo.svg" | prepend: site.baseurl }}" /></h1>
</div>

<div class="w3-container w3-border w3-margin">
<div class="w3-margin" markdown="1">

### Plasma Mobile for Debian
Debian PM is packaging Plasma Mobile for Debian.

The repository contains Plasma Mobile, various mobile apps and Qt built for OpenGL ES devices.

<a class="w3-margin-right w3-button w3-white w3-border" href="{{ "/debian-pm/screenshots/" | prepend: site.baseurl }}">View screenshots</a>
<a class="w3-margin-right w3-button w3-white w3-border" href="https://gitlab.com/debian-pm">Source code on GitLab</a>

### How to use this repository
The repository is signed. The key can be automatically updated, because it's also a package in the repository. For the first-time install, you need to download and install the package manually, afterwards it will be updated using apt. Installing the key this way is reasonably secure, thanks to HTTPS.
<div class="w3-code notranslate">
	wget https://jbb.ghsq.ga/debpm/pool/main/d/debian-pm-repository/debian-pm-archive-keyring_20210819_all.deb
</div>
<div class="w3-code notranslate">
	sudo dpkg -i debian-pm-archive-keyring_20210819_all.deb
</div>
Afterwards, add the following text to `/etc/apt/sources.list.d/debian-pm.list`.
<div class="w3-code notranslate">
	deb https://jbb.ghsq.ga/debpm testing main
</div>

After the next `sudo apt update` you can install packages from the repository.

If your device only supports OpenGL ES, like the Pine Phone does, you may want to install the `debian-pm-repository` package, which configures apt to always install Qt from the debian-pm repository, instead of installing from debian

### Install the base packages of Plasma Mobile

The packages required for a minimal Plasma Mobile experience can be installed using the following command:
```
sudo apt install plasma-phone-components plasma-phone-settings plasma-settings plasma-phonebook plasma-angelfish plasma-nm simplelogin`
```

More apps can be installed from the repository.

</div>
</div>
