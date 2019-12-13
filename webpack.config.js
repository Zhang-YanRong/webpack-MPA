const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); //压缩js
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
const delDir = require('./dellDir')
const ExtractTextPlugin = require('extract-text-webpack-plugin');



function resolve(dir) {
  return path.join(__dirname, dir)
}

const outDir = resolve('dist')
delDir(outDir)

const config = {
  context: path.resolve(__dirname),
  entry: resolve('src/index.js'),
  mode: 'production',
  output: {
    filename: '[name].[hash].bundle.js',
    path: outDir + '/js/'
  },
  // 模块路径解析相关的配置都在 resolve 字段下
  resolve: {
    // 声明node_modules模块
    modules: ['node_modules'],
    alias: {
      "@": resolve('src')
    },
    // 尝试帮你补全那些后缀名来进行查找
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    // 默认寻找的文件名
    mainFiles: ['index'],
  },
  module: {
    // 忽略webpack要编译的文件 如jquery
    noParse(content) {
      return /noParse/.test(content)
    },
    rules: [
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
      {
        test: /\.css$/,
        include: [resolve('src')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname,'dist')
            }
          },
          "css-loader"
        ]
      } 

    ]
  },
  plugins: [
    // new ExtractTextPlugin({
    //   filename:  (getPath) => {
    //     return getPath('../css/[name].[hash].css')
    //   },
    //   allChunks: true
    // }),
    new MiniCssExtractPlugin({ // 替代上面的 ExtractTextPlugin
      filename: "[name].css",
      chunkFilename: "[name].css",
      allChunks: false
    }),
    new UglifyJSPlugin({
      test: /\.js($|\?)/i, //指定文件格式
      include: /\.\/src/, //指定目录
      cache: false, //开启缓存
      parallel: true, //启动并行化，加快构建速度
      sourceMap: true, 
      uglifyOptions: {
        warning: "verbose",
        ecma: 6,
        beautify: false,
        compress: false,
        comments: false,
        mangle: false,
        toplevel: false,
        keep_classnames: true,
        keep_fnames: true,
        mangle: {
          safari10: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      filename: resolve('dist/index.html'), //目标位置
      template: './index.html',
      inject: true,
      title: 'hello-webpack',
      minify: {
        removeComments: true, //去掉注释
        collapseWhitespace: true, //去掉空行
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        // 避免 cssnano 重新计算 z-index
        safe: true,
        // cssnano 集成了autoprefixer的功能
        // 会使用到autoprefixer进行无关前缀的清理
        // 关闭autoprefixer功能
        // 使用postcss的autoprefixer功能
        autoprefixer: false
      },
      canPrint: true
    })],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: '../css/style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      }
    }
  }

};
webpack(config, (err, stats) => {
  console.log('启用webpack!')
})
module.exports = config;