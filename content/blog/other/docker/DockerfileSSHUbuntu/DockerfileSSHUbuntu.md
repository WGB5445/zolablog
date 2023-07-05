---
title: 使用Dockerile部署带有ssh的Ubuntu
date: 2022-05-08 08:57:59
tags:
cover:
---

## 一、Dockerfile 展示

```Dockerfile
FROM ubuntu:20.04
ENV TZ Asia/Shanghai
ENV LANG zh_CN.UTF-8
RUN echo 'root:root' |chpasswd
RUN echo "deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse\n \
deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse \n \
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse\n	\
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse\n"\
            > /etc/apt/sources.list        \
            && apt update && apt install -y \
			openssh-server \
			vim \
			&& apt clean \
			&& rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp* \
			&& echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
RUN mkdir /var/run/sshd

EXPOSE 22
CMD ["/usr/sbin/sshd","-D"]
```

## 二、分步解析

### 1. 容器的选择

> 由于平时使用的大多是 ubuntu 所以这次选择了选择了 ubuntu20.04 版

```Dockerfile
FROM ubuntu:20.04
```

### 2. 环境变量的设置

> 设置时区和文字环境，其实作用并不大，但是还是设置上吧

```Dockerfile
ENV TZ Asia/Shanghai
ENV LANG zh_CN.UTF-8
```

### 3. root 用户的密码更改

> 因为 ssh 时需要用登陆用户名和密码，所以将 root 密码改成自己想要的

```Dockerfile
RUN echo 'root:root' |chpasswd
```

> &emsp;" ："&emsp;前面的 root 是用户名，&emsp;" : " &emsp;后面的 root 是密码

### 4. 换国内源、安装 SSH

> 因为镜像在本地构建，所以使用国内源可以有一个比较好的网速来下载。  
> 然后通过 apt 安装 vim 和 openssh-server 以便使用 ssh 和一些简单的编辑。  
> 当 ssh 使用 root 登陆时需要更改配置中的&emsp;"PermitRootLogin"&emsp; 为 &emsp;"Yes" &emsp;以便 root 用户使用 ssh。

```Dockerfile
RUN echo "deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse\n \
deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse \n \
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse\n	\
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse\n" \
            > /etc/apt/sources.list \
            && apt update && apt install -y \
			openssh-server \
			vim \
			&& apt clean \
			&& rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp* \
			&& echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
```

### 5. 创建 ssh 的目录

> 如果没有这个目录，ssh 是会崩掉的，所以乖乖加上。

```Dockerfile
RUN mkdir /var/run/sshd
```

### 6. 暴露端口

> ssh 默认的端口号是 22 所以在这里我们暴露镜像的端口号。

```Dockerfile
EXPOSE 22
```

### 7. 在开机时启动 ssh 服务

> 虽然在系统中安装了 openssh-server ,但是 ssh 服务仍需要在开机时启动。

```Dockerfile
CMD ["/usr/sbin/sshd","-D"]
```

## 二、构建镜像

### 1. 构建镜像

> 使用 docker build 命令创建一个 名为&emsp;ssh_docker&emsp; 的镜像

```sh
sudo docker build -t ssh_docker .
```

## 三、启动镜像

### 1. 前台启动

> 有时候我们需要前台启动镜像以便之间能和镜像交互，但是这种方法很不推荐。  
> 因为如果你使用了这种方法，构建镜像时的"CMD"命令就不能被执行，所以需要在参数中附带要执行的指令。

```sh
sudo docker run -it  -p 10122:22 ssh_docker  /bin/bash
```

然后需要**手动开启 ssh 功能**

```sh
service ssh start
```

或者

```sh
/usr/sbin/sshd -D
```

### 2. 后台启动

> 这种方法还是比较推荐的，因为这样可以减少交互，使用起来也比较无感。

```sh
sudo docker run -itd  -p 10122:22 ssh_docker
```

这样会自动执行构建时 CMD 的命令，所以 ssh 服务就成功启动了。

## 四、连接 docker

> 在本机使用 ssh 就可以连接 docker 了，注意端口和用户名

```sh
ssh root@127.0.0.1 -p 10122
```

注意：多次开启镜像后连接 ssh 可能出现错误，这时清除该地址的记录就可以了
