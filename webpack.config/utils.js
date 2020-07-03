const path = require('path');
const fs = require('fs')
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 单独打包css

const resolve = (dir) => {
  return path.join(__dirname, '../', dir)
}

const outDir = resolve('dist')

const delDir = (path) => {
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
      fs.rmdirSync(path);
  }
}

// 遍历使用 html-webpack-plugin
const myHtmlWebpackPlugin = () => {
  const time=new Date().getTime();
  let arr = []
  const entryObj = entry('./src/pages/**/*.html', 'pages')
  const keyArr = Object.keys(entryObj)
  keyArr.forEach(item => {
    entryObj[item].forEach( v => {
      const fileName = v.replace('./src/','')
      arr.push(
        new HtmlWebpackPlugin({
          filename: fileName,  //目标位置
          template: v,
          inject: true, //script标签位于html文件的 body 底部
          hash: true,
          chunks: ['vendor', 'common', item],
          minify: {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true,
          }
        })
      )
    })
  })

  return arr
}

// 遍历目标文件 生成 入口文件目录json
const entry = (urlReg, type) => {
  const src = resolve('src')
  var entry = {};
  const arr = glob.sync(urlReg)
    .forEach(function (name) {
      const reg = new RegExp(`src\/${type}\/(.*?)\/`)
      const names = reg.exec(name)[1]
      if(entry[names]){
        entry[names].push(name)
      }else{
        var eArr = [];
        eArr.push(name);
        entry[names] = eArr;
      }
    });
    return entry
}

// 遍历css
const myCssPlugin = () => {
  const time=new Date().getTime();
  let arr = []
  const entryObj = entry('./src/css/**/*.css', 'css')
  const keyArr = Object.keys(entryObj)
  keyArr.forEach(item => {
    entryObj[item].forEach( v => {
      const fileName = v.split('/').pop()
       arr.push(
        new MiniCssExtractPlugin({
          filename: fileName,  //目标位置
          chunkFilename: '/dist/[name][hash].css',
        })
      )
    })
  })

  return arr
}
module.exports  = {resolve, outDir, delDir, entry, myHtmlWebpackPlugin, myCssPlugin}

