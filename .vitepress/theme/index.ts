import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

// 自定义组件
import OrangeText from './components/orange-text.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('OrangeText', OrangeText);
  },
} satisfies Theme;
