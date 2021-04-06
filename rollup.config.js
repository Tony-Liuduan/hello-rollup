import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
    // input: ["./src/index.js"],
    // input: ["./src/es6.js"],
    // input: ["./src/json.js"],
    input: ["./src/utils.ts"],
    output: {
        // file: "./dist/bundle.js",
        // file: "./dist/esBundle.js",
        // file: "./dist/jsonBundle.js",
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
            babelHelpers: "bundled"
        }),         
        json(),      // FIX: 支持 json 模块编译
        // terser(), // FIX: 压缩插件, 支持ES模块
    ],
    // external: ["the-answer"], // 将 the-answer 模块分离出去, 不包含着 bundle.js 中, 表示是外部引用
};