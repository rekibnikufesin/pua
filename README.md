pua
====
## Probably Updates Available
pua is a node command line utility that will read a package.json file and check the npm
registry for available updates. A summary report is generated to make it easy to see which
updates are available, allowing you to quickly analyze the status of updates for your app.

##Installation
Download the git repo from [https://github.com/rekibnikufesin/pua](https://github.com/rekibnikufesin/pua)

##Usage
`node index.js /path/to/package.json`

You can also link it as a global node command by changing to the pua directory, then:

`npm link`

To run pua after linking, just type

`pua /path/to/package.json`


##Contributors
Will Button - [will@willbutton.co](will@willbutton.co) - [@wfbutton](https://twitter.com/wfbutton)