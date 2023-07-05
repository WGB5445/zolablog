---
title: Git的基本代理设置
date: 2021-12-09 15:31:12
cover:
---

## 一、 设置代理

### 1.当前 Git 仓库代理(临时)

```sh
git config http.proxy http://127.0.0.1:10808
```

### 2.全局设置 (永久)

```sh
git config --global http.proxy http://127.0.0.1:10808
```

## 二、取消代理

### 1.取消当前的 Git 仓库代理

```sh
git config --unset http.proxy
```

### 1.取消全局的 Git 仓库代理

```sh
git config --global --unset http.proxy
```
