module.exports = {
  // 每行的最大字符数。通常设置为 80 或 100。
  printWidth: 80,

  // 指定每个缩进级别的空格数。
  tabWidth: 2,

  // 使用空格而不是制表符（Tab）进行缩进。
  useTabs: false,

  // 在语句末尾添加分号。
  semi: true,

  // 使用单引号而不是双引号。
  singleQuote: true,

  // 对象属性中的引号使用方式。可以是 'as-needed'（必要时引号）、'consistent'（统一方式）或 'preserve'（保留原样）。
  quoteProps: 'as-needed',

  // 在 JSX 中使用单引号。
  jsxSingleQuote: false,

  // 使用尾随逗号。选项包括 'none'（无）、'es5'（ES5 标准）和 'all'（所有地方）。
  trailingComma: 'es5',

  // 对象字面量中括号与对象内容之间加空格。
  bracketSpacing: true,

  // 将多行 JSX 元素的 > 放在最后一行的末尾，而不是另起一行。
  jsxBracketSameLine: false,

  // 在只有一个参数的箭头函数中省略括号。选项包括 'avoid'（避免）和 'always'（总是使用）。
  arrowParens: 'avoid',

  // 控制 Markdown 文本中的换行。选项包括 'always'（总是换行）、 'never'（不换行）和 'preserve'（按原文保留）。
  proseWrap: 'preserve',

  // 控制 HTML 文件中的空白符敏感度。选项包括 'css'（遵守 CSS 显示属性规则）、 'strict'（严格模式）和 'ignore'（忽略空白）。
  htmlWhitespaceSensitivity: 'css',

  // 指定换行符。选项包括 'lf'（换行）、 'crlf'（回车换行）、'cr'（回车） 和 'auto'（自动检测）。
  endOfLine: 'lf',

  // 格式化嵌入的代码块。选项包括 'auto'（自动）和 'off'（关闭）。
  embeddedLanguageFormatting: 'auto',
};
