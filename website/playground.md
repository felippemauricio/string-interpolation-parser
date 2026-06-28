# Playground

Edit the `params` and `context` below and watch the result update live. It runs
the real library, bundled straight from source.

<Playground />

::: tip
Only `string` and `number` values in `params` appear in the result. Try adding a
boolean or an object and watch it drop out. Reach into nested data with dotted and
indexed paths such as <code v-pre>{{ user.posts[0].title }}</code>.

This playground also has [filters & fallbacks](/guide/features) enabled. The
registered transforms are `upper`, `lower`, `round` (e.g.
<code v-pre>{{ amount | round: 2 }}</code>) and `currency`, and you can fall back
with <code v-pre>{{ user.name || "there" }}</code>.
:::
