# webpack配置

### CommonJS,AMD,CMD,ES6 遇到的问题

* 目的: 实现es6的写法，使用esport/import
* 方法:
  * 安装 babel-preset-env
  * 创建 .babelrc 文件

```bash
  {
    "presets": ["env"]
  }
```

### css提取

>* 方法1:

  * 安装 extract-text-webpack-plugin
  * 用法：

```bash
  const ExtractTextPlugin = require('extract-text-webpack-plugin');

  // rules
  {
    test: /\.css$/,
    // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
    use: ExtractTextPlugin.extract({ 
      fallback: 'style-loader',
      use: 'css-loader'
    }),
  },

  // plugins
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('../css/[name].[hash].css')
    },
    allChunks: true
  }),
```

>* 方法2: (推荐)

  * 安装 optimize-css-assets-webpack-plugin
  * 用法
```bash
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

  rules: [
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

  plugins: [
    new MiniCssExtractPlugin({ // 替代上面的 ExtractTextPlugin
      filename: "[name].css",
      chunkFilename: "[name].css",
      allChunks: false
    }),
  ]

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

```
