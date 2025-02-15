import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Weichen's blog",
  description: 'study documents',
  base: '/my_blog/',
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
      {
        text: '前端工程化',
        items: [
          {
            text: 'Vue',
            items: [
              { text: 'vue2基础', link: '/fe-project/vue/' },
              { text: 'vue2原理', link: '/fe-project/vue/theory-vue2' },
              { text: 'vue3基础', link: '/fe-project/vue/base-vue3' },
            ],
          },
          {
            text: '打包工具',
            items: [
              { text: 'Webpack', link: '/fe-project/build-tool/webpack' },
            ],
          },
          {
            text: '包管理工具',
            items: [
              {
                text: 'npm&yarn&pnpm',
                link: '/fe-project/package-management/',
              },
            ],
          },
          {
            text: '性能优化',
            items: [
              { text: '基础', link: '/fe-project/performance-optimization/' },
            ],
          },
        ],
      },
      {
        text: '计算机基础',
        items: [
          {
            text: '网络',
            items: [
              { text: 'TCP协议详解', link: '/cs-base/network/tcp' },
              { text: 'HTTP协议详解', link: '/cs-base/network/http' },
            ],
          },
          {
            text: '算法',
            items: [
              { text: '回溯', link: '/cs-base/algorithm/backtrace' },
              { text: '动态规划', link: '/cs-base/algorithm/dynamic-planning' },
              { text: '图论', link: '/cs-base/algorithm/graph' },
            ],
          },
          {
            text: '版本控制',
            items: [{ text: 'Git', link: '/cs-base/git/git' }],
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
    math: true,
    image: {
      lazyLoading: true,
    },
  },
});
