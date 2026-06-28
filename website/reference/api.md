# API

## `parser(params, context, options?)`

```ts
function parser(params: Params, context: Context): ParsedResult;
function parser(params: Params, context: Context, options: Options): Record<string, unknown>;
```

Interpolates the string entries of `params` against `context`. The optional
`options` argument enables the [additive features](/guide/features); without it,
the v1 behaviour is preserved exactly.

### Parameters

| Name      | Type      | Description                                                                  |
| --------- | --------- | ---------------------------------------------------------------------------- |
| `params`  | `Params`  | A map of values. Only `string` and `number` entries survive into the result. |
| `context` | `Context` | The object that <code v-pre>{{ token }}</code> paths are resolved against.   |
| `options` | `Options` | Optional. Enables transforms, `passthrough` and `raw`.                       |

### Returns

Without `options`: `ParsedResult` — a new object containing only the `string` and
`number` entries of `params`. Numbers are copied as-is; strings have every
<code v-pre>{{ token }}</code> replaced. With `options`, the result may contain other value
types (see `passthrough` and `raw`).

### Behaviour

- Tokens use the <code v-pre>{{ path }}</code> syntax; surrounding whitespace is ignored.
- Paths support dot and bracket notation: `a.b[0].c`.
- A missing or falsy step in a path resolves to an empty string (`''`).
- Resolved non-string values are coerced to a string when inserted.

See [Features](/guide/features) for fallbacks, filters, escaping, `passthrough`
and `raw`.

## Types

```ts
/** The object that interpolation tokens are resolved against. */
type Context = Record<string, unknown>;

/** The input map; only string and number values survive by default. */
type Params = Record<string, unknown>;

/** The default parsed output: the string and number entries of Params, interpolated. */
type ParsedResult = Record<string, string | number>;

/** A named transform used as a pipe: {{ path | name: arg }}. */
type Transform = (value: unknown, ...args: Array<string | number>) => unknown;

/** Opt-in options; omitting them preserves the default behaviour. */
interface Options {
  /** Named transforms referenced by `| name` pipes. */
  transforms?: Record<string, Transform>;
  /** Keep parameter values that are neither string nor number. Default: false. */
  passthrough?: boolean;
  /** A whole-string single token resolves to its real-typed value. Default: false. */
  raw?: boolean;
}
```

## Example

```ts
import parser from 'string-interpolation-parser';

parser(
  { greeting: 'Hi {{ user.firstName }} {{ user.lastName }}', count: 3 },
  { user: { firstName: 'Felippe', lastName: 'Murakami' } },
);
// { greeting: 'Hi Felippe Murakami', count: 3 }
```
