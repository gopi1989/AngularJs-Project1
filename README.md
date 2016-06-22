# wepa members site

An internal wepa site for print management.

# Deploy

This site is static, meaning it consists of static files and runs with any HTTP server.
Here's how to build and deploy it:

- Install [Node.JS](https://nodejs.org/en/download/).
- Get the latest code from [`master` branch](https://bitbucket.org/wepanow/angular-members-site/branch/master).
- Run `npm test` to check code style and run tests. Confirm that the project passes QA before deploying!
- Run `npm run build` to build the project.
- Serve contents of `dist/` directory on a subdomain of `wepanow.com`. Use HTTPS.
- Serve `404.html` for all unresolved URLs.

**Gotcha!** If you have problems with fetching Bower dependencies when running
`npm run build`, provide your SSH agent with a key that enables access to
[wepa core library on Bitbucket](https://bitbucket.org/wepanow/angular-core).

**Note:** in the future [Angular HTML5 mode](https://docs.angularjs.org/guide/$location) may be enabled.
Be ready to change the rewrite rule from `404.html` to `index.html`. At this time, the app always
stays on `index.html` (e.g. `index.html/#/login`), so any other route is guaranteed to be a 404.

# Documentation

_TODO_

# Contribute

### Prerequisites

- Install [Git](https://git-scm.com/downloads).
- Install [Node.JS](https://nodejs.org/en/download/).
- Clone the repository: `git clone git@bitbucket.org:wepanow/angular-members-site.git`

### Dev cycle

- Run `npm start` to start a dev server and watch for changes.
- [Write tests](https://en.wikipedia.org/wiki/Test-driven_development).
- Write code. Follow the [Standard JavaScript](http://standardjs.com/rules.html) styleguide.
- When ready, push your commits to a [separate feature branch](http://nvie.com/posts/a-successful-git-branching-model/).

# License

All Rights Reserved. Copyright 2016 wepa, Inc.
