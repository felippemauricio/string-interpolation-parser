import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: false,
    target: 'es2015',
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: true,
    sourcemap: true,
    minify: false,
    target: 'es2015',
    // Preserves v1 behaviour: `require('string-interpolation-parser')` returns the
    // function directly, with the named export attached.
    footer: {
      js: 'module.exports = parser; module.exports.parser = parser; module.exports.default = parser;',
    },
  },
]);
