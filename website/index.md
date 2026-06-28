---
layout: home

hero:
  name: string-interpolation-parser
  text: '{{ token }} interpolation, typed and tiny'
  tagline: A zero-dependency, isomorphic parser that fills {{ token }} placeholders from a context object — with dotted and indexed paths.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Playground
      link: /playground
    - theme: alt
      text: View on GitHub
      link: https://github.com/felippemauricio/string-interpolation-parser

features:
  - title: Tiny & zero-dependency
    details: A single function with no runtime dependencies. Bundled type declarations, dual ESM + CJS builds, ES2015 target.
  - title: Isomorphic
    details: Pure JavaScript with no platform APIs — runs the same in the browser and in Node (>= 12).
  - title: Dotted & indexed paths
    details: Resolve {{ user.posts[0].title }} against nested objects and arrays. Missing or falsy lookups become an empty string.
  - title: Predictable output
    details: Only string and number values survive; numbers pass through untouched and strings are interpolated.
---
