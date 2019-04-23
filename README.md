# String Interpolation {{ HelloWorld }}
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/felippemauricio/string-interpolation-parser/blob/master/LICENSE.md)
[![npm version](https://img.shields.io/npm/v/string-interpolation-parser.svg?style=flat)](https://www.npmjs.com/package/string-interpolation-parser)
[![Build Status](https://travis-ci.org/felippemauricio/string-interpolation-parser.svg?branch=master)](https://travis-ci.org/felippemauricio/string-interpolation-parser)
[![devDependencies Status](https://david-dm.org/felippemauricio/string-interpolation-parser/dev-status.svg)](https://david-dm.org/felippemauricio/string-interpolation-parser?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/felippemauricio/string-interpolation-parser/badge.svg?branch=master)](https://coveralls.io/github/felippemauricio/string-interpolation-parser?branch=master)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/fd5c63)](https://github.com/airbnb/javascript)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/felippemauricio/string-interpolation-parser/pulls)

This package assists with dynamic string interpolation and on the fly value transformation.

## Installation

Using yarn:
```js
yarn add string-interpolation-parser
```

Using npm:

```js
npm i --save string-interpolation-parser
```

## Usage

```js
import parser from 'string-interpolation-parser';

const params = {
  param1: 'Welcome, {{ vendor.name }}',
  param2: 'Welcome the {{ store.data.name }}, Sr. {{ customer }}',
  param3: 10,
  param4: true,
  param5: null,
  param6: undefined,
  param7: 'Hello World',
  param8: '{{var1}}, {{var2}}',
};

const context = {
  vendor: {
    name: 'Felippe Maurício',
  },
  store: {
    data: {
      address: 'RJ',
      name: 'Rio de Janeiro',
    },
  },
  customer: 'Luciana Cabral',
  var1: 'Hello',
  var2: 'World',
};

const result = parser(params, context);

console.log('result = ', result)
// result = {
//   param1: 'Welcome, Felippe Maurício',
//   param2: ''Welcome the Rio de Janeiro, Sr. Luciana Cabral',
//   param3: 10,
//   param7: 'Hello World',
//   param8: 'Hello, World',
// }
```

## API

```js
  parser(params : Object, context : Object) => Object
```

## License

Licensed under the MIT License, Copyright © 2019-present Felippe Maurício.
