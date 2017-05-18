# dokata

[![Greenkeeper badge](https://badges.greenkeeper.io/moqada/dokata.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download-image]][npm-download-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]

Project boilerplate generator.

It is **UNDER DEVELOPMENT**.

## Installation

```
npm install -g dokata
```

## Usage

```
Usage: dokata [options] <generator_path>

Options:
  -o, --output-dir  Set output directory path  [string] [default: "."]
  -l, --list        Listing template names
  --help            Show help  [boolean]
  --version         Show version number  [boolean]

Examples:
  dokata /path/to/generator                     extract template to current dir.
  dokata -o /path/to/output /path/to/generator  extract template to output dir.
  dokata generator_name                         extract template to current dir (MUST: $DOKATA_TEMPLATE_DIR).
  dokata -l                                     Listing template names (MUST: $DOKATA_TEMPLATE_DIR).
```

## Example

- [moqada/dokata-generator-npm](https://github.com/moqada/dokata-generator-npm) - Boilerplate for npm module


[npm-url]: https://www.npmjs.com/package/dokata
[npm-image]: https://img.shields.io/npm/v/dokata.svg?style=flat-square
[npm-download-url]: https://www.npmjs.com/package/dokata
[npm-download-image]: https://img.shields.io/npm/dt/dokata.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/dokata
[travis-image]: https://img.shields.io/travis/moqada/dokata.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/dokata
[daviddm-image]: https://img.shields.io/david/moqada/dokata.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/dokata#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/dokata.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/dokata.svg?style=flat-square
