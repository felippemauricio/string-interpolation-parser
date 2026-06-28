import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Playground from './Playground.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Available in every markdown page as <Playground />.
    app.component('Playground', Playground);
  },
} satisfies Theme;
