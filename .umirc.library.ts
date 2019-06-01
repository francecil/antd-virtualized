import { IBundleOptions } from 'umi-library/src/types';
//note:需要重新run dev 该文件修改才会生效
const options: IBundleOptions = {
  cjs: 'rollup',
  esm: 'rollup',
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
};

export default options;
