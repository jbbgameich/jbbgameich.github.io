---
layout: post
title:  "A month of git-lab"
date:   2020-05-19 02:54:32 +2:00
categories: misc
---

About a month ago I published the initial version of git-lab, a command line client for GitLab.
Lots of new features have been added since then, and I hope you'll find them useful.
Tobias Fella and especially Benjamin Port joined and brought this project forward.

1. Benjamin Port refactored the command line interface to be more familiar to GitLab users, while keeping support for an arcanist-like cli. This means you can now use `git lab mr` instead of `git lab checkout` instead of the diff and patch commands known from arc if you like.

   ![cli after the latest changes](/img/git-lab-cli.png)

1. For more arc compatibility, there is now a `git lab feature` command for switching and creating branches. It does the same as `git branch` and `git checkout -b`, so if you didn't previously use arc you can probably ignore it :)

1. A project search has been added to easily find the repository you want to clone. You can find it as `git lab search`. One limitation is that you currently need to run it in an existing repository, as that's the currently used way to detect the GitLab instance. In the future I plan to make it search all known instances.

1. Images can now be directly uploaded and embedded in merge request descriptions from the command line. Simply reference local images using markdown syntax when writing the description of your merge request, and the images will be uploaded and embedded

   ![screenshot of git lab with markdown support](/img/git-lab-markdown-support.png)

1. Less special, merge requests can now be opened against other branches than master, as supported by the GitLab web interface.

1. Tobias Fella implemented additional options to filter merge requests in `git lab mrs`. You can now filter them by state, by simple passing `--opened`, `--merged` etc.

1. A fork command has been added for managing forks without creating a merge request right away. If you use `git lab mr`, you won't need to use this command, but if you prefer the more traditional way of pushing to the remote manually and clicking the link, you can now do that.

1. The `fork` remote, which is managed by git-lab and used to create merge requests, now uses ssh. This means that using git-lab requires a valid ssh key in your user settings.

1. Benjamin Port implemented an `issues` subcommand, which allows you to keep track of issues you opened to remind yourself of implementing certain features or fixing bugs. Similar to `git lab mrs`, it can filter issues by their state.

1. A `snippet` subcommand has been added that allows easy pasting from the command line. It can either upload files or upload text piped into the `git lab snippet` command. There is a `paste` alias for it that should be more familiar to arc users.

If you want to try git-lab, you can install the current state using pip.
```
pip3 install git+https://invent.kde.org/jbbgameich/git-lab
```
Once git-lab is more feature complete, I'll consider publishing versioned packages.

As git-lab is still pre-release software under development, it is especially helpful if you [report bugs](https://invent.kde.org/jbbgameich/git-lab/issues), they happen! Or even better, if you want to implement a feature that is still missing, please submit a merge request to [the repository](https://invent.kde.org/jbbgameich/git-lab/), maybe even using `git lab mr` :)
