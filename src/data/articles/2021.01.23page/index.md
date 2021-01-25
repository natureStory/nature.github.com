# umi3 升级

目的：

1. 替换 umi3，正常启动（功能不保证完全正常）
   内容要点：
1. 周六升级了一下 umi3，本来看着官方文档挺简单的，但是还是遇到了许多奇奇怪怪的问题，踩了一些坑，记录一下
1. 重点描述一下我遇到的哪些问题，怎么解决的
1. 为了完整复刻，我重新再升级了一次
1. 本次目的只是先跑起来，没有尝试 umi3 的新特性

## 1. 修改 package.json

修改 umi 版本，确保 Node 10.13 或以上

```js
{
  "devDependencies": {
-   "umi": "^2"
+   "umi": "^3"
  }
}
```

升级 umi-plugin-react 为 @umijs/preset-react

```js
{
-   "umi-plugin-react": "1.10.1",
+   "@umijs/preset-react": "^1"，
}
```

删除 package-lock.json、yarn.lock，并使用 yarn 安装

## 2. 修改 .umirc.js 配置

拍平 plugins，官方写法：

```
export default {
- plugins: [
-   ['umi-plugin-react', {
-     dva: {},
-     antd: {},
-     ...
-   }]
- ],
+ dva: {},
+ antd: {},
+ ...
}
```

**重点来了：**

.umirc.js router 格式变了，需要替换为数组

```js
// 旧
{
  routes: {
    exclude: [
      /model\.(j|t)sx?$/,
      /service\.(j|t)sx?$/,
      /constants?\.jsx?/,
      /models\//,
      /services\//,
      /_components\//,
      /mock\//,
      /demo\//,
    ],
  },
}
// 新
{
  routes: [{
    exclude: [
      /model\.(j|t)sx?$/,
      /service\.(j|t)sx?$/,
      /constants?\.jsx?/,
      /models\//,
      /services\//,
      /_components\//,
      /mock\//,
      /demo\//,
    ],
  }],
}
```

hash

```js
// 旧
{
  plugins: [
    [
      "umi-plugin-rehash",
      {
        hash: RELEASE_TAG,
      },
    ],
  ];
}
// 新。不过丢掉了RELEASE_TAG，还没看怎么加上
{
  hash: true;
}
```

dynamicImport

```js
// 旧
{
  dynamicImport: {
    // 配置动态加载
    webpackChunkName: true
    loadingComponent: './components/loading',
  }
}
// 新
{
  dynamicImport: {
    // 配置动态加载
    loading: './components/loading',
  }
}
```

theme

```js
// 旧
{
  theme: "./config/theme.js";
}
// 新。先注释掉吧，新的是要一个对象配置，这个文件如何引用没看
{
  // theme: './config/theme.js'
}
```

title

```js
// 旧
{
  title: {
    defaultTitle: 'Moka HCM',
  }
}
// 新
{
  title: 'Moka HCM'
}
```

minimizer, antd, babelrc, dva, dll。先统统注释掉，umi3 内置配置或不再支持。

```js
{
  // minimizer: 'terserjs',
  // antd: {},
  // babelrc: true,
  // dva: {
  //   immer: true,
  //   dynamicImport: undefined,
  //   hmr: true,
  // },
  // dll: {
  //   exclude: [
  //     'npm-run-all',
  //     'nodemon',
  //   ],
  // },
}
```

## 3. npm run start 试试

报错如下：

```
(node:13998) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
 DONE  Compiled successfully in 7128ms                                         3:21:32 PM


  App running at:
  - Local:   http://localhost:8001 (copied to clipboard)
  - Network: http://192.168.1.9:8001
```

只需将舜阳的一个插件注释即可，应该是不兼容：

```js
{
  // chainWebpack(config) {
  //   config.plugin('BenchmarkWebpackPlugin').use(BenchmarkWebpakPlugin);
  // },
}
```

## 3. 再次 npm run start 试试

编译成功，访问失败。
别着急，还没改完呢，至少目前配置层面已完成，再修改代码层面的。

## 4. umi/xxx。不再保留 umi/xxx 的接口，全部从 umi 中 import。

```js
{
  - import Link from 'umi/link';
  + import { Link } from 'umi';
  - import withRouter from 'umi/withRouter';
  + import { withRouter } from 'umi';
}
```

## 5. CSS 里引用别名或三方库

```less
.btnMoreStyle:hover .bag {
  background: url('~@assets/buttonMoreHover.png') no-repeat center top;
  background-size: contain;
}
```

## 5. router 改用 history 代替。

```js
{
  - import router from 'umi/router';
  + import { history } from 'umi';

  - router.push('/foo');
  + history.push('/foo');
}
```

## 特殊报错处理：

1. yarn start 报错

```
Invariant failed: Hash history needs a DOM
```

解决方案：

```js
// 注释掉 dva 相关配置，配置错误（目前没有看具体应该怎么配置）
{
  // plugins: [
  //   'dva',
  // ],
  // dva: {
  //   immer: true,
  //   // dynamicImport: undefined,
  //   hmr: true,
  // }
}
```

2. yarn start 报错，仅说有一个 error，却不显示具体报错

```
Failed to compile with 1 errors
```

解决方案：

1. 全局(包含 node modules)搜索关键字 "Failed to compile with"
2. 找到的文件为 node_modules/friendly-errors-webpack-plugin/src/friendly-errors-plugin.js
3. 可以找到报错代码，读取逻辑，可知打印 topErrors 就可以知道报错信息，因此添加 console 打印如下：
```js
  displayErrors(errors, severity) {
    const processedErrors = transformErrors(errors, this.transformers);

    const topErrors = getMaxSeverityErrors(processedErrors);
    const nbErrors = topErrors.length;
    console.log(JSON.stringify(topErrors));

    const subtitle = severity === 'error' ?
      `Failed to compile with ${nbErrors} ${severity}s` :
      `Compiled with ${nbErrors} ${severity}s`;
    output.title(severity, severity.toUpperCase(), subtitle);

    if (this.onErrors) {
      this.onErrors(severity, topErrors);
    }

    formatErrors(topErrors, this.formatters, severity)
      .forEach(chunk => output.log(chunk));
  }
```
4. 可以看到打印了很多错误，并非一条。（推测是因为报错太多阻塞了打印）

```
……

~@assets/details/backout.svg in ./src/components/DetailsTaskNew/index.jsx

……
```

5. 这个错误可知，是我们全局替换
