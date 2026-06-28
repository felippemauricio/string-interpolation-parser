# string-interpolation-parser

[![npm version](https://img.shields.io/npm/v/string-interpolation-parser.svg?style=flat)](https://www.npmjs.com/package/string-interpolation-parser)
[![CI](https://github.com/felippemauricio/string-interpolation-parser/actions/workflows/ci.yml/badge.svg)](https://github.com/felippemauricio/string-interpolation-parser/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/felippemauricio/string-interpolation-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/felippemauricio/string-interpolation-parser)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/felippemauricio/string-interpolation-parser/blob/master/LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/felippemauricio/string-interpolation-parser/pulls)

A tiny, typed, **isomorphic** parser for `{{ token }}` string interpolation. Give
it a map of parameters and a context object, and it returns the map with every
placeholder filled in from the context — resolving dotted and indexed paths along
the way.

- 🪶 **Tiny & zero-dependency** — one function, bundled types, dual ESM + CJS.
- 🌐 **Isomorphic** — pure JavaScript, runs the same in the browser and Node (>= 12).
- 🎯 **Dotted & indexed paths** — `{{ user.posts[0].title }}` just works.
- ✅ **Predictable** — only string and number values survive; missing lookups
  become an empty string, never an error.

**[Docs & live playground →](https://felippemauricio.github.io/string-interpolation-parser/)**

## Installation

```sh
npm install string-interpolation-parser
```

## Usage

```ts
import parser from 'string-interpolation-parser';

const params = {
  welcome: 'Welcome, {{ vendor.name }}',
  order: 'Hi {{ customer }}, shipping to {{ store.data.name }}',
  headline: 'Read now: {{ user.posts[0].title }}',
  total: 10,
  ignored: true, // dropped — not a string or number
};

const context = {
  vendor: { name: 'Felippe Maurício' },
  store: { data: { name: 'Rio de Janeiro' } },
  customer: 'Luciana Cabral',
  user: { posts: [{ title: 'Designing an API with GraphQL' }] },
};

parser(params, context);
// {
//   welcome: 'Welcome, Felippe Maurício',
//   order: 'Hi Luciana Cabral, shipping to Rio de Janeiro',
//   headline: 'Read now: Designing an API with GraphQL',
//   total: 10,
// }
```

`require` also works and returns the function directly:

```js
const parser = require('string-interpolation-parser');
```

## Behaviour

- **Only `string` and `number` values are kept** — anything else is dropped.
- **Numbers pass through untouched**; only strings are interpolated.
- **Tokens are `{{ path }}`**; whitespace inside the braces is ignored.
- **Paths support dot and bracket notation** (`a.b[0].c`).
- **Missing or falsy lookups resolve to an empty string** — no errors thrown.

## Features

All additive and opt-in — the defaults above are unchanged.

```ts
// Fallbacks — used when the token would render empty (quote to keep spaces)
parser({ hi: 'Hi {{ user.name || Guest }}' }, {});
// { hi: 'Hi Guest' }

// Filters (pipes) — chainable, resolved from options.transforms
parser(
  { p: '$ {{ amount | round: 2 }}' },
  { amount: 9.5 },
  {
    transforms: { round: (v, d) => Number(v).toFixed(Number(d)) },
  },
);
// { p: '$ 9.50' }

// Escaping — emit literal braces
parser({ d: 'Use \\{{ token }} to interpolate' }, {});
// { d: 'Use {{ token }} to interpolate' }

// passthrough — keep non-string/number values
parser({ flag: true, hi: '{{ name }}' }, { name: 'Felippe' }, { passthrough: true });
// { flag: true, hi: 'Felippe' }

// raw — a single whole-string token keeps its real type
parser({ user: '{{ account.user }}' }, { account: { user: { id: 1 } } }, { raw: true });
// { user: { id: 1 } }
```

## API

```ts
parser(params: Params, context: Context, options?: Options): Record<string, unknown>
```

See the [API reference](https://felippemauricio.github.io/string-interpolation-parser/reference/api)
for the full type definitions.

## License

Licensed under the MIT License, Copyright © 2019-present Felippe Maurício.
