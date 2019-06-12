const fs = require('fs');
const path = require('path');
const packageInfo = require('./package.json');
// We need compile additional content for antd user
function finalizeCompile () {
  if (fs.existsSync(path.join(__dirname, './lib'))) {
    // Build package.json version to lib/version/index.js
    // prevent json-loader needing in user-side
    const versionFilePath = path.join(process.cwd(), 'lib', 'version', 'index.js');
    const versionFileContent = fs.readFileSync(versionFilePath).toString();
    fs.writeFileSync(
      versionFilePath,
      versionFileContent.replace(
        /require\(('|")\.\.\/\.\.\/package\.json('|")\)/,
        `{ version: '${packageInfo.version}' }`,
      ),
    );
    // eslint-disable-next-line
    console.log('Wrote version into lib/version/index.js');

    // Build package.json version to lib/version/index.d.ts
    // prevent https://github.com/ant-design/ant-design/issues/4935
    const versionDefPath = path.join(process.cwd(), 'lib', 'version', 'index.d.ts');
    fs.writeFileSync(
      versionDefPath,
      `declare var _default: "${packageInfo.version}";\nexport default _default;\n`,
    );
    // eslint-disable-next-line
    console.log('Wrote version into lib/version/index.d.ts');

    // Build a entry less file to dist/antd.less
    const componentsPath = path.join(process.cwd(), 'src');
    let componentsLessContent = '';
    // Build components in one file: lib/style/components.less
    fs.readdir(componentsPath, (err, files) => {
      files.forEach(file => {
        if (fs.existsSync(path.join(componentsPath, file, 'style', 'index.less'))) {
          componentsLessContent += `@import "../${path.join(file, 'style', 'index.less')}";\n`.replace(/\\/g, '/');
        }
      });
      fs.writeFileSync(
        path.join(process.cwd(), 'lib', 'style', 'components.less'),
        componentsLessContent,
      );
    });
  }
}

function finalizeDist () {
  if (fs.existsSync(path.join(__dirname, './dist'))) {
    // Build less entry file: dist/antdv.less
    fs.writeFileSync(
      path.join(process.cwd(), 'dist', 'antdv.less'),
      '@import "../lib/style/index.less";\n@import "../lib/style/components.less";',
    );

    // eslint-disable-next-line
    console.log('Built a entry less file to dist/antdv.less');
  }
}
function finalizeCss () {
  if (fs.existsSync(path.join(__dirname, './dist/antdv.less')) && !fs.existsSync(path.join(__dirname, './dist/antdv.css'))) {
    // Build less entry file: dist/antdv.less
    fs.writeFileSync(
      path.join(process.cwd(), 'dist', 'css.js'),
      'import "./antdv.less";',
    );

    // eslint-disable-next-line
    console.log('Built a entry js file to dist/css.js');
  }
}
function clearDistUseless () {
  const deleteAll = function (url) {
    console.log('delete useless file:', url)
    if (fs.existsSync(url)) {
      if (fs.statSync(url).isDirectory()) {
        //文件及子目录数组
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
          var curPath = path.join(url, file);
          //文件夹，递归
          if (fs.statSync(curPath).isDirectory()) {
            deleteAll(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(url);
      } else {
        fs.unlinkSync(url);
      }


    }
  }
  const resolveFile = function (filePath) {
    return path.join(__dirname, 'dist', filePath)
  }
  deleteAll(resolveFile('src'))
  deleteAll(resolveFile('css.js'))
  deleteAll(resolveFile('css.bundle.js'))

}
const isClear = process.argv.indexOf('clear') !== -1
console.log('isClear-------->', isClear)
if (isClear) {
  clearDistUseless()
} else {
  finalizeCompile()
  finalizeDist()
  finalizeCss()
}