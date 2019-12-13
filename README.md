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

>* 方法2:

  * 安装 
