import { IBundleOptions } from 'father/src/types';
//note:需要重新run dev 该文件修改才会生效
const options: IBundleOptions = {
  entry: 'src/index.ts',
  cjs: 'babel',
  esm: 'babel',
  extractCSS: true,
  doc: {
    themeConfig: {
      title: 'Antd Virtualized',
      colors: {
        primary: '#bd4932',
        link: '#bd4932',
      },
    },
    typescript: true,
    menu: [
      {
        name: '介绍'
      },
      {
        name: '快速开始'
      },
      {
        name: '脚手架'
      },
      {
        name: '组件规范'
      },
      {
        name: 'FAQ'
      },
      {
        name: 'Components'
      },
    ]
  },
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ]
};

export default options;
