# wepa Angular core

This module is used to communicate with [wepa cloud server](https://www.wepanow.com/).

Example:

```JavaScript
app.controller('MyController', function (wepaCore) {
  this.login = function (username, password) {
    wepaCore.login(username, password)
  }
})
```

# Install

To use this module, get it via [Bower](http://bower.io/):

- `bower install git@bitbucket.org:wepanow/angular-core.git`
- Include this file before your code: `./bower_components/wepa-core/dist/wepa.js`

Alternatively, download a build manually from Bitbucket:

- Download this directory: `https://bitbucket.org/wepanow/angular-core.git/dist/`
- Include this file before your code: `{library}/wepa-angular-core/dist/wepa.js`

# Documentation

Please refer to the [API docs](./doc/wepaCore.module.md).

# Contribute

### Prerequisites

- Install [Git](https://git-scm.com/downloads).
- Install [Node.JS](https://nodejs.org/en/download/).
- Clone the repository: `git clone git@bitbucket.org:wepanow/angular-core.git`

### Dev cycle

- Run `npm start` - it will check code style, run tests, build, generate docs and watch for changes.
- [Write tests](https://en.wikipedia.org/wiki/Test-driven_development).
- Write code.
- When ready, push your commits to a [separate feature branch](http://nvie.com/posts/a-successful-git-branching-model/).

# License

All Rights Reserved. Copyright 2016 wepa, Inc.
