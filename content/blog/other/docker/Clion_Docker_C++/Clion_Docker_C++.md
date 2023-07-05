---
title: Clion-Docker的C\C++调试环境
date: 2021-08-01 19:57:59
tags:
cover:
---

## 环境信息

- CLion 2021.1.1
- Docker version 20.10.8, build 3967b7d
- Docker 镜像 Ubuntu20.04

## 一、制作镜像

### 1. 编写 Dockerfile

```Dockerfile
FROM ubuntu:20.04

RUN echo 'root:root' |chpasswd
RUN echo "deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse\n \
deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse \n \
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse\n	\
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse\n" \
			> /etc/apt/sources.list\
			&& apt update && apt install -y \
			gcc \
			g++ \
			cmake\
			make \
			#openssh-client \
			openssh-server \
			#ssh \
			gdb \
			rsync\
			#vim \
			#clang\
			&& apt clean \
			&& rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/* \
			&& echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

RUN mkdir /var/run/sshd

EXPOSE 22

CMD ["/usr/sbin/sshd","-D"]
```

> 看需求按照 gcc、g++ 等，如有其他需要可以在里面加。

#### 2. 构建镜像

```sh
sudo docker build -t C++_docker .
```

> 构建成功就有提示：
>
> > Successfully built fdf5d0cdc6f2  
> > Successfully tagged test:latest

## 二、运行镜像

```sh
sudo docker run -itd  -p 10122:22 _docker
```

## 三、Clion 设置

### 1. 首先在 CLion 中添加 SSH

> 在设置中的**工具** ---> **SSH 配置** ---> **点击+号添加**

<img src="./Clion_Docker_C++/添加SSH.png">

### 2. 在 Clion 添加工具链

> 在设置中的 **构建、执行、部署** ---> **工具链** ---> **点击+号添加**

<img src="./Clion_Docker_C++/添加工具链.png">

### 3. 在 Clion 添加远程 cmake

- 1. **构建、执行、部署**
- 2. **cmake**
- 3. **点击+号添加**
- 4. **修改名称为自己需要的名称**
- 5. **构建类型选择自己需要的类型**
- 6. **工具链选择刚刚创建的工具链**
- 7. **其他选项看情况修改**

<img src="./Clion_Docker_C++/添加cmake.png">

### 4.重新载入 cmake 项目

> 点击主界面上栏的 **文件** 中的 **重新加载 cmake 项目**

### 5.查看、设置构建项

> 把构建配置选为刚刚设置的配置

<img src="./Clion_Docker_C++/查看构建项.png">

## 四、完成

### 1. 运行

> 可以看到在生成的目录是远程的目录

<img src="./Clion_Docker_C++/结果.png">

### 2. 调试

> 调试也正常

<img src="./Clion_Docker_C++/调试结果.png">
