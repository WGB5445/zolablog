---
title: Ubuntu上编译xmrig
date: 2021-10-08 17:18:36
cover:
---

## Ubuntu 上编译 xmrig

> 本文作者: [WGB](https://wgb5445.github.io/)

          Twitter: [wgb5445](https://twitter.com/wgb5445)

## 工具

- ubuntu 系统
- 网络

## 步骤

1. 安装编译工具以及需要的库
2. 下载源码
3. 编译
4. 成功

## 一、安装工具以及需要的库

在 Ubuntu 上编译 xmrig 需要使用编译工具 make cmake gcc g++等  
下载代码需要使用 git  
编译 xmrig 时可以使用附加库 libhwloc-dev libuv1-dev libssl-dev  
如果不需要这些库，可以在编译时加选项跳过

### 1. 更新 apt 源

先更新源以防止出现找不到包等问题

```sh
sudo apt update
```

### 2. 安装

```sh
sudo apt install make cmake gcc g++ git libhwloc-dev libuv1-dev libssl-dev
```

## 二、下载源码

通过 git 工具下载 xmrig 源码(国内用户链接可能较慢)

```sh
git clone https://github.com/xmrig/xmrig.git
```

## 三、编译

### 1. 进入 xmrig 文件夹

```sh
cd xmrig/
```

### 2. 创建 build 文件夹

```sh
mkdir build
```

### 3. 执行编译命令

cmake 编译选项可以在 xmrig 官网查看,可以通过编译选项去掉或者添加功能  
xmrig-CMake 选项:[https://xmrig.com/docs/miner/cmake-options](https://xmrig.com/docs/miner/cmake-options)

```sh
cmake ..
```

```sh
make
```

## 四、生成可执行文件 xmrig

经过编译后可以生成可执行文件 xmrig，可以使用 ls 命令查看是否生成

```sh
ls
```

出现 xmrig 就代表已经成功

```
CMakeCache.txt  CMakeFiles  cmake_install.cmake  config.json  libxmrig-asm.a  Makefile  src  xmrig
```
