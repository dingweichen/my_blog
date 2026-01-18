import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useMermaidPanZoom } from './components/vitepress-plugin-mermaid-pan-zoom/index';
import './components/vitepress-plugin-mermaid-pan-zoom/style.css';

// 自定义组件
import OrangeText from './components/orange-text.vue';
import XmindViewer from './components/xmind-viewer.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('OrangeText', OrangeText);
    app.component('XmindViewer', XmindViewer);
  },
  setup() {
    useMermaidPanZoom();
  },
} satisfies Theme;
