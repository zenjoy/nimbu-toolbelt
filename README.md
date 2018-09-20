nimbu-toolbelt
==============

Tools for Nimbu projects

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nimbu-toolbelt.svg)](https://npmjs.org/package/nimbu-toolbelt)
[![Downloads/week](https://img.shields.io/npm/dw/nimbu-toolbelt.svg)](https://npmjs.org/package/nimbu-toolbelt)
[![License](https://img.shields.io/npm/l/nimbu-toolbelt.svg)](https://github.com/zenjoy/nimbu-toolbelt/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g nimbu-toolbelt
$ nimbu-toolbelt COMMAND
running command...
$ nimbu-toolbelt (-v|--version|version)
nimbu-toolbelt/1.0.0 darwin-x64 node-v10.2.1
$ nimbu-toolbelt --help [COMMAND]
USAGE
  $ nimbu-toolbelt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nimbu-toolbelt hello [FILE]`](#nimbu-toolbelt-hello-file)
* [`nimbu-toolbelt help [COMMAND]`](#nimbu-toolbelt-help-command)

## `nimbu-toolbelt hello [FILE]`

describe the command here

```
USAGE
  $ nimbu-toolbelt hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ nimbu-toolbelt hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/zenjoy/nimbu-toolbelt/blob/v1.0.0/src/commands/hello.ts)_

## `nimbu-toolbelt help [COMMAND]`

display help for nimbu-toolbelt

```
USAGE
  $ nimbu-toolbelt help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_
<!-- commandsstop -->
