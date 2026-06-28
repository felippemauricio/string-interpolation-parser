# Features

Everything here is **additive and opt-in** — the default behaviour is unchanged,
so existing callers see identical output. Try any of it live in the
[playground](/playground).

## Fallbacks

Add <code v-pre>|| literal</code> to a token and the literal is used whenever the
token would otherwise render empty:

```ts
parser({ hi: 'Hi {{ user.name || Guest }}' }, {});
// { hi: 'Hi Guest' }
```

Quote the literal to keep surrounding spaces:

```ts
parser({ hi: 'Hi {{ user.name || "no name on file" }}' }, { user: {} });
// { hi: 'Hi no name on file' }
```

## Filters (pipes)

Pipe a value through one or more named transforms with <code v-pre>| name</code>.
Transforms are supplied via `options.transforms` and can take colon-separated
arguments (numbers are parsed as numbers, everything else as strings):

```ts
const transforms = {
  upper: (v) => String(v).toUpperCase(),
  round: (v, digits) => Number(v).toFixed(Number(digits)),
};

parser(
  { line: '{{ name | upper }} costs $ {{ price | round: 2 }}' },
  { name: 'pen', price: 9.5 },
  {
    transforms,
  },
);
// { line: 'PEN costs $ 9.50' }
```

Filters chain left to right. Referencing a transform that was not registered
throws `Unknown transform "<name>"`.

## Escaping

Prefix a token with a backslash to emit the braces literally instead of
interpolating:

```ts
parser({ doc: 'Use \\{{ token }} to interpolate {{ what }}' }, { what: 'values' });
// { doc: 'Use {{ token }} to interpolate values' }
```

## `passthrough`

By default, parameter values that are neither `string` nor `number` are dropped.
Set `passthrough: true` to keep them as-is:

```ts
parser({ enabled: true, greeting: '{{ name }}' }, { name: 'Felippe' }, { passthrough: true });
// { enabled: true, greeting: 'Felippe' }
```

## `raw`

When a parameter string is exactly one token, `raw: true` returns the resolved
value with its real type instead of stringifying it — handy for building
payloads rather than display strings:

```ts
parser(
  { user: '{{ account.user }}' },
  { account: { user: { id: 1, name: 'Felippe' } } },
  {
    raw: true,
  },
);
// { user: { id: 1, name: 'Felippe' } }
```

A `raw` token still honours fallbacks (<code v-pre>{{ account.user || none }}</code>),
and resolves to `undefined` when absent with no fallback.
