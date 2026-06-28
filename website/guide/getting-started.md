# What & why

`string-interpolation-parser` takes a map of parameters and a context object, and
returns the same map with every <code v-pre>{{ token }}</code> placeholder replaced by the matching
value from the context.

It is deliberately small: one function, no runtime dependencies, and the same
behaviour in the browser and in Node.

## At a glance

```ts
import parser from 'string-interpolation-parser';

const params = {
  welcome: 'Welcome, {{ vendor.name }}',
  order: 'Hi {{ customer }}, shipping to {{ store.data.name }}',
  total: 10,
  ignored: true, // dropped — not a string or number
};

const context = {
  vendor: { name: 'Felippe Maurício' },
  store: { data: { name: 'Rio de Janeiro' } },
  customer: 'Luciana Cabral',
};

parser(params, context);
// {
//   welcome: 'Welcome, Felippe Maurício',
//   order: 'Hi Luciana Cabral, shipping to Rio de Janeiro',
//   total: 10,
// }
```

## The rules

- **Only `string` and `number` values are kept.** Anything else (booleans,
  `null`, `undefined`, arrays, objects) is dropped from the result.
- **Numbers pass through untouched.** Only string values are interpolated.
- **Tokens are <code v-pre>{{ ... }}</code>.** Whitespace inside the braces is ignored, so
  <code v-pre>{{ user }}</code> and <code v-pre>{{user}}</code> are equivalent.
- **Paths can be dotted and indexed.** <code v-pre>{{ user.posts[0].title }}</code> walks objects
  and arrays alike.
- **Missing or falsy lookups become an empty string.** No errors are thrown for
  absent keys.

Opt-in extras — fallbacks, filters, escaping, `passthrough` and `raw` — are
covered in [Features](/guide/features); the defaults above never change.

Try it live in the [playground](/playground), or read the full
[API reference](/reference/api).
