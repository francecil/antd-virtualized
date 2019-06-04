<h1 align="center">Antd Virtualized</h1>
<div align="center">

Ant Design 组件的长列表支持方案

</div>

简体中文 | [English](./README-en_US.md)

## ✨ 特性

- 按需加载，与`antd`一样的配置
- 样式分离，方便覆盖
- 使用 TypeScript 构建
- 采用 Umi 的组件打包方式

## 🖥 支持环境

- 现代浏览器和 IE9 及以上。
  
## 📦 安装

```bash
npm install antd-virtualized --save
```

```bash
yarn add antd-virtualized
```

## 🔨 示例

```jsx
import { Select } from 'antd-virtualized';
ReactDOM.render(<Select />, mountNode);
```

~~引入样式：~~
暂不支持全局引入，只能按需引入


### 按需加载

参考: antd 的 [按需加载组件](https://ant.design/docs/react/getting-started-cn#按需加载)

如果你在开发环境的控制台看到下面的提示，那么你可能使用了`import { Select } from 'antd-virtualized';` 的写法引入了 antd-virtualized 下所有的模块，这会影响应用的网络性能。
```
You are using a whole package of antd virtualized, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
```
可以通过以下的写法来按需加载组件。

```jsx
import Select from 'antd-virtualized/lib/select';
import 'antd-virtualized/lib/select/style'; // 或者 antd-virtualized/lib/select/style/css 加载 css 文件
```
> antd-virtualized/es/select 可以加载 ES 版本的模块，方便进一步 Tree Shake.

如果你使用了 babel，那么可以使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 来进行按需加载，加入这个插件后。你可以仍然这么写：

```jsx
import { Select } from 'antd-virtualized';
```

由于该项目借用了 antd 的 `babel-plugin-import` 插件，故配置与 antd 是一样的，

譬如在 create-react-app 中 是通过 react-app-rewired + babel-plugin-import 按需加载 antd (以及less)) 的 
```js
const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  })
);
```

那么只需要再加上 antd-virtualized 的配置即可， 即
```js
const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  fixBabelImports('antd-virtualized', {
    libraryName: 'antd-virtualized',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  })
);
```
### TypeScript

支持，无需额外配置，antd 进行配置即可

参考 [在 TypeScript 中使用](https://ant.design/docs/react/use-in-typescript-cn)

## 🌍 国际化

支持，无需额外配置，antd 进行配置即可

参考 [国际化文档](http://ant.design/docs/react/i18n-cn)。

## ⌨️ 本地开发

```bash
$ git clone git@github.com:francecil/antd-virtualized.git
$ cd antd-virtualized
$ npm install
$ npm start
```

打开浏览器访问 http://127.0.0.1:8001 ，自带组件文档。

## LICENSE

MIT
