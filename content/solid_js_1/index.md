+++
title="用 Solidjs 搭建第一个网页"
date="2023-07-22 19:04:23"

[taxonomies]
Categories=['Solidjs']
Tags=['JavaScript','Html','TypeScript']
+++

## 新一代高性能的 JavaScript UI 库

Solidjs 和 Vue、React 类似都是前端框架，不过 Solidjs 没有采用虚拟 DOM 实现，编译后的 Js 依赖会很小，同时运行速度也不慢。
写起来的感觉约等于 React，以后我准备多用 Solid 接活了(缺点就是没 React 库多...)

### SolidJS 的特性

- 响应式编程：SolidJS 采用 Fine-grained Reactivity 模型，可以对组件进行细粒度的响应式追踪，仅在数据变化时更新必要的 DOM 部分。这使得 SolidJS 在处理大规模数据时表现出色，并且能够实现更高效的性能。

- 组件化开发：SolidJS 采用类似于 React 的组件化开发模式，允许开发者将 UI 拆分成小块、可复用的组件，提高代码的可维护性和复用性。

- 模板语法：SolidJS 支持类似于 JSX 的模板语法，使得编写组件的代码更加简洁易读。

- 优秀的 TypeScript 支持：SolidJS 原生支持 TypeScript，提供了完整的类型检查和智能提示，帮助开发者减少潜在的错误。

- 无虚拟 DOM（No Virtual DOM）：SolidJS 与传统虚拟 DOM 不同，它使用了 Fine-grained Reactivity 来实现 DOM 更新，从而不需要创建中间状态的虚拟 DOM 对象，减少了内存开销和运算时间。

## 快速开始

使用 SolidJS 构建项目非常简单，我推荐使用 Vite 创建一个新项目，因为 webpack 太难用了..(生理不适)

### 创建项目

根据 Vite 官网指示，用 [pnpm](https://pnpm.io/) 来创建项目(相比于 npm 、Yarn 能节省宝贵的磁盘空间)

```
pnpm create vite my-solid-project --template solid-ts
```

### 进入目录

然后就可以进入到目录中并执行 `pnpm install` 安装依赖

```
cd my-solid-project
```

### 安装依赖

```
pnpm install
```

### 启动 Dev 开发服务器

```
pnpm dev
```

### 打开网页

浏览器访问 `http://localhost:5173` 就可以看到你第一个 Solidjs 的页面啦
点击 屏幕上的 `count is 0` 按钮就能看到按钮中的数字在 +1 +1 +1 +1

## 成功

好！下期再见！
