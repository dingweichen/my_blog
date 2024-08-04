import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Weichen's blog",
  description: 'study documents',
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      //   { text: 'Home', link: '/' }, // 主页先不显示
      { text: '学习记录', link: '/fe-base/html-css/' },
    ],

    sidebar: [
      {
        text: '前端基础',
        items: [
          {
            text: 'HTML+CSS',
            // collapsed: true,
            items: [{ text: '基础', link: '/fe-base/html-css/' }],
          },
          {
            text: 'JavaScript',
            // collapsed: true,
            items: [
              { text: '基础', link: '/fe-base/javascript/' },
              { text: 'WebApi', link: '/fe-base/javascript/web-api' },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/dingweichen' }],

    // 自定义配置上下页上方的文本
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    // 自定义配置上次更新的文本和日期格式
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    // 开启本地搜索
    search: {
      provider: 'local',
    },
    // 页面目录
    outline: {
      level: [2, 3],
      label: '页面导航',
    },
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
});
