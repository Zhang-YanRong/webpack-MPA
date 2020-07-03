const webpack = require('webpack'); //访问内置的插件
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); //压缩js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 单独打包css

const {resolve, delDir, outDir, entry, myHtmlWebpackPlugin, myCssPlugin} = require('./webpack.config/utils')
const rules = require('./webpack.config/rules')
const { Console } = require('console');
// import Lodash from 'lodash'
const time=new Date().getTime();

delDir(outDir)
const config = {
  context: path.resolve(__dirname),
  entry: entry('./src/js/**/*.js', 'js'),
  mode: 'production',
  output: {
    filename: 'js/[name]/[name].bundle.js',
    path: outDir,
    chunkFilename: '[name].[hash].js',
    publicPath: '/dist/'
    // publicPath: process.env.NODE_ENV === 'development' ? '../../' : '../../'
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
  devServer: {
    contentBase: resolve('/dist/pages/'), // 服务的内容目录
    port: 4396, // 搭建在本地的服务的端口号
    compress: true, // 服务开启gzip压缩
    // open: true,
    // publicPath: '../',
		host: "127.0.0.1",
		overlay: true,
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
        }, 
        '/': {
          bypass: function(req, res, proxyOptions) {
            const path = req.url
            console.log(path, process.env.NODE_ENV)
            if(path === '/'){
              return  'home/home.html';
            } 
          }
        }
    }
  },
  module: {
    // 忽略webpack要编译的文件 如jquery
    noParse(content) {
      return /noParse/.test(content)
    },
    rules,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    // new ExtractTextPlugin({
    //   filename:  (getPath) => {
    //     return getPath('../css/[name].[hash].css')
    //   },
    //   allChunks: true
    // }),
    new MiniCssExtractPlugin({ // 替代上面的 ExtractTextPlugin
      filename: "css/[name].css",
      chunkFilename: "css/[name][hash].css",
      allChunks: false
    }),
    // ...myCssPlugin(),
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
    ...myHtmlWebpackPlugin()
  ],
  optimization: {
    // runtimeChunk: true,

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
      // chunks: 'async',
      // minSize: 30000,
      // // minRemainingSize: 0,
      // maxSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 6,
      // maxInitialRequests: 4,
      // automaticNameDelimiter: '~',
      cacheGroups: {
        styles: {
          name: 'common/' + time,
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          minSize: 0, // 只要超出0字节就生成一个新包
          minChunks: 2
        },
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名    
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        
        common: { // 抽离自己写的公共代码，common这个名字可以随意起
          chunks: 'initial',
          name: 'common', // 任意命名
          minSize: 0, // 只要超出0字节就生成一个新包
          minChunks: 2
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }

};





webpack(config, (err, stats) => {
  console.log('启用webpack!')
})
module.exports = config;