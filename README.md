# hello-rollup

若你项目只需要打包出一个简单的bundle包，并是基于ES6模块开发的，可以考虑使用rollup

## webpack vs rollup

### 共同点

* 将多个 js 文件打包成 1 个 js 文件
* Tree-shaking (webpack2.0 rollup)

### 区别

* 代码分割 (webpack)
* 模块热替换（HMR）(webpack)
* 静态资源模块导入 (webpack)
* 开发应用 (webpack)
* 开发库 (rollup)
* rollup.js 编译源码中的模块引用默认只支持 ES6+的模块方式 import/export, 需要通过 commonjs插件 (@rollup/plugin-commonjs) 解决问题

## rollup 优缺点

1. 缺点: 基于 esmodule (import export), 它通过插件处理大多数 CommonJS 文件的时候，一些代码将无法被翻译为 ES2015
2. 优点: 无多余的模块加载函数, 都在 1 个文件中

## rollup 配置参数

* -f。-f参数是--format的缩写，它表示生成代码的格式，amd表示采用AMD标准，cjs为CommonJS标准，esm（或 es）为ES模块标准。-f的值可以为amd、cjs、system、esm（'es’也可以）、iife或umd中的任何一个
* -o。-o指定了输出的路径，这里我们将打包后的文件输出到dist目录下的bundle.js
* -c。指定rollup的配置文件
* -w。监听源文件是否有改动，如果有改动，重新打包, 包括 rollup.config.js

## rollup 配置文件

* input表示入口文件的路径（老版本为 entry，已经废弃）
* output表示输出文件的内容，它允许传入一个对象或一个数组，当为数组时，依次输出多个文件，它包含以下内容：
  * output.file：输出文件的路径（老版本为 dest，已经废弃）
  * output.format：输出文件的格式
  * output.banner：文件头部添加的内容
  * output.footer：文件末尾添加的内容

## 第三方包依赖解析处理

FIX: Unresolved dependencies the-answer (imported by src/index.js), Missing global variable name

```shell
yarn add -D @rollup/plugin-node-resolve
yarn add -D @rollup/plugin-commonjs
```

```js
// rollup.json
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: ["./src/index.js"],
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "experience", // umd 模式必须要有 name  此属性作为全局变量访问打包结果
  },
  plugins: [
        resolve(),  // FIX: Unresolved dependencies the-answer (imported by src/index.js), Missing global variable name
        commonjs(), // FIX: 使得rollup.js编译支持npm模块和CommonJS模块方式的插件, 否则只支持 esm
    ], 
  // external: ["the-answer"], // 将 the-answer 模块分离出去, 不包含着 bundle.js 中, 表示是外部引用
};
```

## es6 语法转 es5

```sh
yarn add -D @rollup/plugin-babel
yarn add -D @babel/core
yarn add -D @babel/preset-env
```

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
    input: ["./src/es6.js"],
    output: {
        file: "./dist/esBundle.js",
        format: "umd",
        name: "experience",
    },
    plugins: [
        resolve(),
        commonjs(),
        babel(),    // FIX: es6 转 es5
    ], 
    // external: ["the-answer"]
};
```

```json
// .bablerc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
        // "useBuiltIns": "usage"
      }
    ]
  ]
}
```

## ts 处理

```sh
yarn add -D typescript
yarn add -D rollup-plugin-typescript2
```

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: ["./src/utils.ts"],
    output: {
        file: `./dist/tsBundle.js`,
        format: "umd",
        name: "experience", // umd 模式必须要有 name  此属性作为全局变量访问打包结果
        sourcemap: true,
    },
    plugins: [
        resolve(),    // FIX: Unresolved dependencies the-answer (imported by src/index.js), Missing global variable name
        commonjs(),   // FIX: 使得rollup.js编译支持npm模块和CommonJS模块方式的插件, 否则只支持 esm
        typescript({  // FIX: ts 处理, 注意: 顺序不能换, 先处理 tsc, 在处理 babel
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false, // 输出时去除类型文件
                },
            },
        }),
        babel({      // FIX: es6 转 es5
            extensions: [".js", ".ts"],
            exclude: "node_modules/**",
            babelHelpers: 'bundled'
        }),         
        json(),      // FIX: 支持 json 模块编译
    ],
    // external: ["the-answer"]
};
```

## rollup 插件

> <https://juejin.cn/post/6844903721051111437>

## pkg.module

> <https://github.com/rollup/rollup/wiki/ES6-modules>
> For Rollup to work its magic, it needs the library to be written in ES6 modules. The library's package.json file should use the module field to point to the main file.

```json
{
  "name": "my-package",
  "version": "0.1.0",
  "main": "dist/my-package.umd.js",
  "module": "dist/my-package.esm.js"
}
```
