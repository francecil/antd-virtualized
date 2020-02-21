/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV;
if (
  ENV !== 'production' &&
  ENV !== 'test' &&
  typeof console !== 'undefined' &&
  // eslint-disable-next-line
  console.warn &&
  typeof window !== 'undefined'
) {
  // eslint-disable-next-line
  console.warn(
    'You are using a whole package of antd virtualized, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  );
}
/* @remove-on-es-build-end */

export { default as Select } from './select';
export { default as TreeSelect } from './tree-select';
export { default as Tree } from './tree';
export { default as Version } from './version';
