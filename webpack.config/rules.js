const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 单独打包css

const {entry,outDir, resolve} = require('./utils')
// css目录
const cssRules = () => {
  let arr = []
  const entryObj = entry('./src/css/**/*.css', 'css')
  const keyArr = Object.keys(entryObj)
  keyArr.forEach(item => {
    entryObj[item].forEach( v => {
      const fileName = v.replace('./src/','')
      console.log(fileName, 'css')
      console.log(outDir + '/')
      arr.push(
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            filename: fileName,
            fallback: "style-loader",
            use: "css-loader",
            publicPath: outDir + '/'
          })
        }
      )
    })
  })
  return arr
}
console.log(cssRules)
module.exports = [
  // {
  //   test: /\.css$/,
  //   use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] : ExtractTextPlugin.extract({
  //     fallback: "style-loader",
  //     use: ["css-loader", "sass-loader", "postcss-loader"],
  //     // css中的基础路径
  //     publicPath: outDir + '/css'
  //   })
  // },
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        // options: {
        //   publicPath: path.resolve(__dirname,'dist/1')
        // },
      },
      'css-loader',
    ],
  },
  // ...cssRules(),
  {
    test: /\.(js|jsx)$/,
    include: [resolve('src')],
    use: {
      loader: 'babel-loader',
      
    },
  },
  // {
  //   test: /\.css$/,
  //   // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
  //   use: ExtractTextPlugin.extract({ 
  //     fallback: 'style-loader',
  //     use: 'css-loader'
  //   }), 
  // },
  // {
  //   test: /\.css$/,
  //   include: [resolve('src')],
  //   use: [
  //     {
  //       loader: MiniCssExtractPlugin.loader,
  //       options: {
  //         publicPath: path.resolve(__dirname,'dist/css')
  //       }
  //     },
  //     "css-loader"
  //   ]
  // }

]