import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

// Published as a GitHub Pages project site at /string-interpolation-parser/.
export default defineConfig({
  title: 'string-interpolation-parser',
  description:
    'A tiny, typed, isomorphic parser for {{ token }} string interpolation with dotted and indexed context paths.',
  lang: 'en-AU',
  base: '/string-interpolation-parser/',
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  head: [['meta', { name: 'theme-color', content: '#fd5c63' }]],

  vite: {
    resolve: {
      alias: {
        // The live playground runs the real library, bundled from source.
        'string-interpolation-parser': fileURLToPath(
          new URL('../../src/index.ts', import.meta.url),
        ),
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/reference/api' },
      { text: 'Playground', link: '/playground' },
      { text: 'npm', link: 'https://www.npmjs.com/package/string-interpolation-parser' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What & why', link: '/guide/getting-started' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Features', link: '/guide/features' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '/reference/api' },
          { text: 'Playground', link: '/playground' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/felippemauricio/string-interpolation-parser' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/felippemauricio/' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        '© 2019-present <a href="https://www.linkedin.com/in/felippemauricio/">Felippe Maurício</a>',
    },

    search: { provider: 'local' },
  },
});
