import { IBundleOptions } from 'father/src/types';

const docConfig: any = {
  base: '/antd-virtualized/',
  themeConfig: {
    title: 'Ant Design 长列表',
    codemirrorTheme: 'dracula',
  },
  theme: 'docz-theme-default',
  htmlContext: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://codemirror.net/theme/dracula.css',
        },
      ],
    },
  },
  ignore: [
    'README.md',
    'README-en_US.md',
    'changelog.md',
    'code_of_conduct.md',
    'contributing.md',
    'license.md',
  ],
  typescript: true,
  codeSandbox: false,
  menu: [
    {
      name: '介绍',
    },
    {
      name: '快速开始',
    },
    {
      name: '脚手架',
    },
    {
      name: '组件规范',
    },
    {
      name: 'FAQ',
    },
    {
      name: 'Components',
    },
  ],
};
//note:需要重新run dev 该文件修改才会生效
const options: IBundleOptions = {
  entry: 'src/index.ts',
  cjs: 'babel',
  esm: 'babel',
  umd: {
    name: 'antd-virtualized',
    globals: {
      react: 'React',
      antd: 'antd',
    },
    file: 'index',
  },
  extractCSS: true,
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  doc: docConfig,
};

export default options;
