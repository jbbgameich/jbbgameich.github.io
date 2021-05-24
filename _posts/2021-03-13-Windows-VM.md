---
layout: post
title:  "How I stand working with Windows VMs"
date:   2021-03-13
categories: misc
---

Sometimes you find yourself in the need of having to use Windows, to port your applications to the platform using the awesome Craft buildsystem.

Since as Plasma users, the Windows GUI (especially the Powershell terminal emulator) is most likely only going to be a disappointment,
let's set up an openssh server, so we can use the virtual machine from our beloved terminal emulator, Konsole.

Microsoft themselves describe how this can be done in [a tutorial](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse).

Afterwards, let's set the default shell to powershell, since powershell has more of a chance of being a useful command line environment than cmd.
```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force
```
Now you can ssh into your new virtual machine.

To make Windows somewhat usable for a Unix user, install the basic command line tools (and starship, since the powershell prompt is quite ugly)
```powershell
choco install vim
choco install starship
choco install busybox
choco install git
choco install wget

busybox --install
rm C:/ProgramData/chocolatey/lib/busybox/tools/sh.exe # sh can conflict with Craft according to Craft
choco install gnuwin32-coreutils.portable
```

Using the vim we just installed, we can edit the profile to automatically load sharship and the busybox utils.
Open the profile in vim `vim $PROFILE`, and enter the following content:
```powershell
Invoke-Expression (&starship init powershell)

$env:Path += "C:/ProgramData/chocolatey/lib/busybox/tools/"
```

After a fresh login, you should be greeted by a nice looking prompt, that features git,
basic command line tools so you don't have too look everything up just to build your software on Windows.

Tip: powershell has some builtins that have the same name as some of the busybox and coreutils.
To use the proper coreutil instead, you can use for example `ls.exe` instead of `ls`.

If you prefer the busybox version of some command, you can directly call it using `busybox ls`.

I hope this can make your Windows porting experience a little better :)
