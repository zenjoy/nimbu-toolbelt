nimbu-toolbelt
==============

Toolbelt for Nimbu projects

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nimbu-toolbelt.svg)](https://npmjs.org/package/nimbu-toolbelt)
[![Downloads/week](https://img.shields.io/npm/dw/nimbu-toolbelt.svg)](https://npmjs.org/package/nimbu-toolbelt)
[![License](https://img.shields.io/npm/l/nimbu-toolbelt.svg)](https://github.com/zenjoy/nimbu-toolbelt/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Features](#features)
<!-- tocstop -->
 
# Usage

## Prerequisites

You need a recent `node` and `yarn`. On Mac OS X:

```
brew install node yarn
```

You still need what was needed to use the old toolchain (`ruby`, `bundler`, ...)

## Getting started

Add this package to your project:

```
yarn add --dev nimbu-toolbelt
```

This will also execute `bundle install` to install the old toolchain it uses.

## Development server

To start developing on your project that uses this toolbelt, just run:

```
yarn start
```

This will start a `webpack-dev-server` (and the old `nimbu server` that it
proxies to). Your browser should automatically open a connection to it at
`http://localhost:4567/`.

## Pushing to nimbu

1. Stop your development server
2. Make a production build with `yarn build`
3. Push to nimbu with `yarn nimbu themes:push` (this calls the ruby-based
   toolchain -> all arguments you know are supported)

NOTE: Both the development and production webpack configuration generate
`snippets/webpack.liquid` that gives access to the information about which files
webpack generated. This should be included and used in the layout of your theme.
Make sure that include is there and that you push the snippet to nimbu!

# Commands
<!-- commands -->
* [`nimbu auth:login`](#nimbu-authlogin)
* [`nimbu auth:logout`](#nimbu-authlogout)
* [`nimbu auth:token`](#nimbu-authtoken)
* [`nimbu browse:admin`](#nimbu-browseadmin)
* [`nimbu browse:simulator`](#nimbu-browsesimulator)
* [`nimbu build`](#nimbu-build)
* [`nimbu help [COMMAND]`](#nimbu-help-command)
* [`nimbu init`](#nimbu-init)
* [`nimbu server`](#nimbu-server)
* [`nimbu sites:list`](#nimbu-siteslist)
* [`nimbu themes:diff [THEME]`](#nimbu-themesdiff-theme)
* [`nimbu themes:list [THEME]`](#nimbu-themeslist-theme)
* [`nimbu themes:push [FILES]`](#nimbu-themespush-files)

## `nimbu auth:login`

log in with your nimbu credentials

```
USAGE
  $ nimbu auth:login
```

_See code: [src/commands/auth/login.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/auth/login.ts)_

## `nimbu auth:logout`

clear local authentication credentials

```
USAGE
  $ nimbu auth:logout
```

_See code: [src/commands/auth/logout.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/auth/logout.ts)_

## `nimbu auth:token`

display your api token

```
USAGE
  $ nimbu auth:token
```

_See code: [src/commands/auth/token.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/auth/token.ts)_

## `nimbu browse:admin`

open the admin area for your current site

```
USAGE
  $ nimbu browse:admin
```

_See code: [src/commands/browse/admin.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/browse/admin.ts)_

## `nimbu browse:simulator`

open the simulator for your current site

```
USAGE
  $ nimbu browse:simulator
```

_See code: [src/commands/browse/simulator.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/browse/simulator.ts)_

## `nimbu build`

build a production version of your javascript and CSS

```
USAGE
  $ nimbu build
```

_See code: [src/commands/build.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/build.ts)_

## `nimbu help [COMMAND]`

display help for nimbu

```
USAGE
  $ nimbu help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_

## `nimbu init`

initialize your working directory to code a selected theme

```
USAGE
  $ nimbu init
```

_See code: [src/commands/init/index.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/init/index.ts)_

## `nimbu server`

run the development server

```
USAGE
  $ nimbu server

OPTIONS
  --nocookies
```

_See code: [src/commands/server.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/server.ts)_

## `nimbu sites:list`

list sites you can edit

```
USAGE
  $ nimbu sites:list
```

_See code: [src/commands/sites/list.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/sites/list.ts)_

## `nimbu themes:diff [THEME]`

describe the command here

```
USAGE
  $ nimbu themes:diff [THEME]

ARGUMENTS
  THEME  The name of the theme to list
```

_See code: [src/commands/themes/diff.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/themes/diff.ts)_

## `nimbu themes:list [THEME]`

list all layouts, templates and assets

```
USAGE
  $ nimbu themes:list [THEME]

ARGUMENTS
  THEME  The name of the theme to list
```

_See code: [src/commands/themes/list.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/themes/list.ts)_

## `nimbu themes:push [FILES]`

describe the command here

```
USAGE
  $ nimbu themes:push [FILES]

ARGUMENTS
  FILES  The files to push with --only

OPTIONS
  --css-only     only push css
  --fonts-only   only push fonts
  --force        skip the usage check and upload anyway
  --images-only  only push new images
  --js-only      only push javascript
  --liquid-only  only push template code
  --only         only push the files given on the command line
```

_See code: [src/commands/themes/push.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.1/src/commands/themes/push.ts)_
<!-- commandsstop -->

# Features

Webpack is configured to support the features below.

## Coffeescript/Javascript

The javascripts pipeline supports:

- Coffeescript 2
  ([Breaking changes from 1.x](http://coffeescript.org/#breaking-changes))
- ES6 syntax with all features and polyfills that
  [create react app supports](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#supported-language-features-and-polyfills)

There is one entrypoint `src/index.js` that gets compiled into `javascripts/app.js` and
  `javascripts/vendor.js` (split automatically).

## (S)CSS

The CSS pipeline supports:

- SCSS using `sass-loader`
- Minification and autoprefixing using `postcss-loader` and `autoprefixer`

The entrypoint is `src/index.scss`, but any (S)CSS you import in your javascript
or coffeescript will also be included in the output.

To import scss files from `node_modules`, use a `~` prefix. For example,
to import bourbon that was added with `yarn add bourbon`:

```
@import '~bourbon/core/bourbon';
```

In development mode, the CSS is injected dynamically into the DOM using
`style-loader` to support Hot Module Reloading. In production, the CSS is
extracted into `stylesheets/app.css`.

Sometimes the dynamic injecting of CSS breaks stuff. For example, if you use
javascript plugins that measure certain widths/heights when the document is
ready. These might execute before the styles get injected. To test these kind of
things, you can tell webpack to extract the CSS into `stylesheets/app.css` in
development too. Start the development server with the following command to do
that:

```
EXTRACT_CSS=true yarn start
```

## Using the webpack output in your layout

Webpack generates `snippets/webpack.liquid`. If you include that snippet, you
get access to:

- `webpack_build_timestamp`: timestamp of the moment that webpack generated the
  snippet. Useful in a cache key.
- `webpack_chunks`: an array of the names of the chunks that webpack generated.
- `webpack_js`: a map of chunkname to javascript filename for that chunk.
- `webpack_css`: a map of chunkname to array of css filenames for that chunk.

For example, you can use this snippet of liquid in your layout:

```
{% include 'webpack' %}
{% for chunk in webpack_chunks, cache: webpack_build_timestamp %}
{% for file in webpack_css[chunk] %}
{{ file | stylesheet_tag }}
{% endfor %}
{% endfor %}

{% for chunk in webpack_chunks, cache: webpack_build_timestamp %}
{{ webpack_js[chunk] | javascript_tag }}
{% endfor %}
```
