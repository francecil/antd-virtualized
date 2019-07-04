import { css } from 'docz-plugin-umi-css';
import { join, dirname } from 'path';
import { createPlugin } from 'docz-core';

const reactExternal = () =>
  createPlugin({
    onCreateWebpackChain(config) {
      config.externals({
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
      });
      return config;
    },
    setConfig(config) {
      const flag = process.env.NODE_ENV === 'development' ? 'development' : 'production.min';
      config.htmlContext.head = config.htmlContext.head || {};
      config.htmlContext.head.scripts = config.htmlContext.head.scripts || [];
      config.htmlContext.head.scripts.push({
        src: `https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.${flag}.js`,
      });
      config.htmlContext.head.scripts.push({
        src: `https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.${flag}.js`,
      });
      return config;
    },
  });
const cssModuleRegex = /\.module\.css$/;
const lessModuleRegex = /\.module\.less$/;

export default {
  typescript: true,
  base: '/antd-virtualized/',
  title: 'france',
  themeConfig: {
    title: 'Ant Design 长列表',
    codemirrorTheme: 'dracula',
  },
  native: true,
  debug: true,
  propsParser: true,
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
  modifyBabelRc(babelrc, args) {
    // 需放 class-properties 前面
    babelrc.plugins.unshift([
      require.resolve('@babel/plugin-proposal-decorators'),
      { legacy: true },
    ]);

    babelrc.plugins = [
      ...babelrc.plugins,
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    ];

    return babelrc;
  },
  modifyBundlerConfig(config, dev, args) {
    if (!dev) {
      // do not generate doc sourcemap
      config.devtool = false;

      // support disable minimize via process.env.COMPRESS
      if (process.env.COMPRESS === 'none') {
        config.optimization.minimize = false;
      }
    }

    // 确保只有一个版本的 docz，否则 theme 会出错，因为 ComponentProvider 的 context 不是同一个
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.docz = dirname(require.resolve('docz/package.json'));

    // 透传 BIGFISH_VERSION 环境变量
    config.plugins.push(
      new (require('webpack')).DefinePlugin({
        'process.env.BIGFISH_VERSION': JSON.stringify(process.env.BIGFISH_VERSION),
      }),
    );

    // fallback resolve 路径
    config.resolve.modules.push(join(__dirname, '../../node_modules'));
    config.resolveLoader.modules.push(join(__dirname, '../../node_modules'));

    return config;
  },
  plugins: [
    reactExternal(),
    // .css
    css({
      preprocessor: 'postcss',
      ruleOpts: {
        exclude: cssModuleRegex,
      },
      cssmodules: false,
    }),
    css({
      preprocessor: 'postcss',
      ruleOpts: {
        test: cssModuleRegex,
      },
      cssmodules: true,
    }),

    // .less
    css({
      preprocessor: 'less',
      ruleOpts: {
        exclude: lessModuleRegex,
      },
      cssmodules: false,
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
    css({
      preprocessor: 'less',
      ruleOpts: {
        test: lessModuleRegex,
      },
      cssmodules: true,
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
  ],
};
