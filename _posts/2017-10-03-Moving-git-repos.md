---
layout: post
title:  "My experiences with moving git repositories"
date:   2017-10-03 12:01:00 +2:00
categories: git
---

### Moving a gist to a real github or gitea / gogs repository

Sometimes you start writing a small script which doesn't need a real git repository because it's just one file, but after a while the script grows and is not only one file anymore. Maybe you also need pull requests but github gists do not have support for them.

It's really easy to move from a gist to a real repository. Just use the "import repository" function of the github web interface and import the gist url.

![BlogImage](https://imgload.org/images/Spectacle.a13149aab2e75e8af02000.png)

The same does also work fine with the gitea web interface. Just go to "New migration", and migrate your gist like described with github.

This does only work because gists are already using git in the background. You can also clone gists and push updates to them from the command line.

### Moving from github to gitea or gogs

After doing this a few times this week, I really love the interface of gitea. Migrating a existing repository works exactly as described with gists above. An additional, very useful feature of gitea, is that you can enable a mirror option. Gitea will then check for new updates daily and pull them into the mirrored repository.

![BlogImage](https://imgload.org/images/Screenshot-2017-10-3-Rasputin-Gitea192f4de6759e375e.md.png)
If you somehow don't fully trust github, setting up a mirror on your selfhosted gitea instance is the best workaround.

### SVN -> Git

If you have to migrate an SVN repository into git, I can really recommend to read [this post](https://john.albin.net/git/convert-subversion-to-git).

Instead of step 4, you can also create a new repository on gitea or github and push the newly converted commits to there.
