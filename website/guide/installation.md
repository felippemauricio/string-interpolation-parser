# Installation

```sh
npm install string-interpolation-parser
```

```sh
yarn add string-interpolation-parser
```

```sh
pnpm add string-interpolation-parser
```

The package ships dual builds and bundled type declarations, so it works in both
module systems with no extra `@types` package.

## ESM

```ts
import parser from 'string-interpolation-parser';
// or the named export
import { parser } from 'string-interpolation-parser';
```

## CommonJS

`require` returns the function directly, preserving the v1 behaviour:

```js
const parser = require('string-interpolation-parser');
```

## TypeScript

The public types are exported for convenience:

```ts
import type { Context, Params, ParsedResult } from 'string-interpolation-parser';
```
