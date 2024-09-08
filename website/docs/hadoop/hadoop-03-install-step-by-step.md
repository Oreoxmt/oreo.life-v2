---
layout: post
title: 读书笔记：3-STEP BY STEP Hadoop 安装手册
date: 2021-01-23 20:12:54
tags:
- Start with Me
- Book
categories:
- Reading
---
《Hadoop 权威指南》读书笔记第三篇带你一步一步安装 Hadoop

<!-- more -->

# 3 STEP BY STEP - Apache Hadoop 伪分布模式安装手册

全网最详细，最适合像我一样的初学者的 Hadoop 安装手册来啦（

# 安装环境

腾讯云服务器，Ubuntu 18.04 LTS

# 准备工作

## Docker

### 为什么要用 Docker？

Docker 采用 Linux 的容器技术实现内外环境隔离。由于 Hadoop 安装复杂，为了避免出现问题，破坏主机环境，所以采用 Docker 来建立容器，在容器内进行 Hadoop 的安装实验。而且，DockerHub 上提供了 [官方 OpenJDK 镜像](https://hub.docker.com/_/openjdk)，这样就不需要在主机上配置 Java 环境了。

### 如何安装 Docker？

参考 Docker 官网提供的教程 [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/) ，按照下列步骤云服务器上安装 Docker：

```bash
$ # 安装前置项
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
$ # 添加 Docker Repo
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt update
$ # 安装 Docker
$ sudo apt install docker-ce docker-ce-cli containerd.io
$ # 启动 Docker 服务
$ sudo systemctl start docker
$ # 将当前用户添加到 docker 用户组
$ usermod -aG docker $(whoami)
```

完成上述步骤后，为了让用户组生效，输入 `exit` 断开 SSH 连接并重连。

## 容器环境配置

### 下载 OpenJDK 镜像

Dockers 默认会从 DockerHub 官方地址 [dockerhub.io](http://dockerhub.io) 拉取镜像，该地址在国内访问非常慢。为了提高镜像拉取速度，先在主机上配置腾讯云 DockerHub 镜像（虽然找不到官方文档，但它能用。其他云服务商的用户烦请自行查找合适的镜像地址）。在 `/etc/docker/daemon.json` 中添加如下内容：

```json
{ "registry-mirrors": [ "https://mirror.ccs.tencentyun.com" ] }
```

重启 Docker 服务：

```bash
$ sudo systemctl restart docker
```

此时 DockerHub 镜像应当已经生效，通过 `docker info` 验证

```bash
$ docker info
Registry Mirrors:
  https://mirror.ccs.tencentyun.com/
```

然后使用 `docker pull` 拉取 Java 8 的 [OpenJDK 镜像](https://hub.docker.com/_/openjdk)：

```bash
$ docker pull openjdk:8
Status: Downloaded newer image for openjdk:8
docker.io/library/openjdk:8
```

### 运行 OpenJDK 容器

在服务器上执行命令：

```bash
$ mkdir -p ~/hadoop  # 建立 hadoop 目录，后续会把它作为工作目录
$ docker run \
		-d --init \
		-w /home/$(whoami)/hadoop \
		-v /home/$(whoami)/hadoop:/home/$(whoami)/hadoop \
		--name hadoop-test openjdk:8 \
		tail -f /dev/null
```

其中：

- `-d --init`：使容器在后台正常运行，退出的进程能被正确回收
- `-w /home/$(whoami)/hadoop`：设置工作目录
- `-v /home/$(whoami)/hadoop:/home/$(whoami)/hadoop`：在容器内外共享 `~/hadoop` 目录
- `--name hadoop-test openjdk:8`：容器名称 `hadoop-test`，镜像名称 `openjdk:8`
- `tail -f /dev/null`：令保持容器运行不退出的命令

### 容器环境配置

需要进行以下操作：

1. 配置容器内的用户，使其与外部用户一致

    原因为 Hadoop 不允许以 `root` 用户运行。

2. 配置容器内的 Debian 源镜像

    原因为 OpenJDK 使用的是官方 Debian 源，国内访问速度缓慢。

3. 配置 SSH 服务以及无密码认证

    原因为伪分布式服务需要 SSH 可以连通本机。对于 Docker 容器来说等价于容器可以使用 SSH 连通本容器。

首先配置用户：

```bash
$ # 使用 whoami 获取用户名，使用 id -u 获取用户 UID
$ docker exec hadoop-test \
		useradd $(whoami) -u $(id -u) -s /bin/bash
$ # 修改 home 目录的权限为新创建的用户
$ docker exec hadoop-test \
		chown $(whoami):$(whoami) /home/$(whoami)
```

随后在容器内配置腾讯云 Debian 镜像（其他云服务商用户请自行查找对应的源）：

```bash
$ docker exec hadoop-test \
		sed -i -r 's/[a-z]+.debian.org/mirrors.tencentyun.com/' /etc/apt/sources.list
```

然后安装并启动 SSH 服务：

```bash
$ docker exec hadoop-test \
		bash -c 'apt update && apt install -y openssh-server && service ssh start'
[ ok ] Starting OpenBSD Secure Shell server: sshd.
```

一直到这里，我们终于完成了容器的环境配置，可以以普通用户身份进入 `hadoop-test` 容器了：

```bash
$ docker exec -it --user $(whoami) hadoop-test bash
```

进入后，应该会看到一个类似 `username@abcd1234ef56:~/hadoop$` 的命令行，其中 `username` 是容器外的用户名，`abcd1234ef56` 是一串随机的容器 ID。

如果还是觉得难以区分不同的 Shell，这里提供一个小技巧，可以在命令行前显示一个标识字符串：

```bash
$ # 执行前先使用 exit 退出容器，回到服务器命令行
$ # 在容器内的 /etc/debian_chroot 中写入字符串 my_hadoop
$ echo my_hadoop | docker exec -i hadoop-test tee /etc/debian_chroot
```

执行完后，再次使用 `docker exec -it --user $(whoami) hadoop-test bash` 进入容器，可以得到一个类似 `(my_hadoop)username@abcd1234ef56:~/hadoop$` 的命令行，这样就很方便区分了。

当然这个技巧只对 Debian 系统有效。

慢着，我们还要配置 SSH 访问，通过下列命令（下面会使用 `(my_hadoop)` 前缀来区分是服务器上还是容器内执行命令 ）：

```bash
(my_hadoop) $ ssh-keygen
(my_hadoop) $ # 一路回车，会产生私钥 ~/.ssh/id_rsa 和公钥 ~/.ssh/id_rsa.pub
(my_hadoop) $ # 然后需要对新创建的公钥进行授权
(my_hadoop) $ cat ~/.ssh/id_rsa.pub > ~/.ssh/authorized_keys
(my_hadoop) $ # 完成授权，进行测试
(my_hadoop) $ ssh localhost
```

若成功，应该会进入一个新的 Shell，命令行同样为 `(my_hadoop)username@abcd1234ef56:~/hadoop$`

至此，通过 OpenJDK 容器来运行 Hadoop 的前置项配置完毕。

# 安装 Hadoop

## 下载 Hadoop Release 压缩包

可以从 [Apache 官网的 Release 页面](https://hadoop.apache.org/releases.html)下载，当然同样，速度会非常缓慢。这里可以使用 [TUNA 镜像](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/)、[BIT 镜像](http://mirror.bit.edu.cn/apache/hadoop/common/)和[阿里云镜像](https://mirrors.aliyun.com/apache/hadoop/common/)等。

截至本文发出，最新版本是 v3.3.0，使用 `wget` 命令下载，使用 `tar` 命令解压：

```bash
(my_hadoop) $ wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz
(my_hadoop) $ tar xzf hadoop-3.3.0.tar.gz
```

会在当前目录下产生一个名为 `hadoop-3.3.0` 的目录：

```bash
(my_hadoop) $ cd hadoop-3.3.0
(my_hadoop) $ ls
LICENSE-binary  NOTICE-binary  README.txt  etc      lib      licenses-binary  share
LICENSE.txt     NOTICE.txt     bin         include  libexec  sbin
```

## 配置 Hadoop 运行环境与参数

### Shell 环境变量

Hadoop 的正常运行需要环境变量 `${HADOOP_HOME}` 和 `${JAVA_HOME}`，同时为了能方便地执行命令，也可以把 `hadoop-3.3.0` 目录下的 `bin` 和 `sbin` 目录加入环境变量 `${PATH}`。

```bash
(my_hadoop) $ # 假设现在处于 hadoop-3.3.0 目录下
(my_hadoop) $ export HADOOP_HOME="$(pwd)"
(my_hadoop) $ export PATH="${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin:${PATH}"
```

执行 `hadoop version` 验证 `${PATH}` 已经生效：

```bash
(my_hadoop) $ hadoop version
Hadoop 3.3.0
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r aa96f1871bfd858f9bac59cf2a81ec470da649af
Compiled by brahma on 2020-07-06T18:44Z
Compiled with protoc 3.7.1
From source with checksum 5dc29b802d6ccd77b262ef9d04d19c4
```

为了在下次进入容器时可以直接使用上述 Hadoop 环境，可以把上边这两行添加到 `~/.bashrc`：

```bash
(my_hadoop) $ # 假设现在处于 hadoop-3.3.0 目录下
(my_hadoop) $ echo 'export HADOOP_HOME='"'$(pwd)'" >> ~/.bashrc
(my_hadoop) $ echo 'export PATH="${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin:${PATH}"' >> ~/.bashrc
```

退出容器并再次进入，直接执行 `hadoop version` 验证 `~/.bashrc` 的改动已经生效：

```bash
(my_hadoop) $ exit
            $ # 注意这里已经退出到主机环境
            $ docker exec -it --user $(whoami) hadoop-test bash
(my_hadoop) $ hadoop version
Hadoop 3.3.0
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r aa96f1871bfd858f9bac59cf2a81ec470da649af
Compiled by brahma on 2020-07-06T18:44Z
Compiled with protoc 3.7.1
From source with checksum 5dc29b802d6ccd77b262ef9d04d19c4
```

### Hadoop 运行参数

可以根据自身需求在 `${HADOOP_HOME}/etc/hadoop/hadoop-env.sh` 中配置供 Hadoop 使用的环境变量。在这里我们暂时所有 `HADOOP_` 开头的都使用默认值。

由于 [Docker 和 SSH 的一个问题](https://github.com/moby/moby/issues/2569#issuecomment-27973910)，使用 `ssh localhost` 命令连接到自身的时候会丢失 `${JAVA_HOME}` 环境变量，因此在这里把 `${JAVA_HOME}` 写到 `hadoop-env.sh` 中：

```bash
(my_hadoop) $ echo 'export JAVA_HOME='"'${JAVA_HOME}'" >> ${HADOOP_HOME}/etc/hadoop/hadoop-env.sh
```

### Hadoop 配置文件

使用 `WinSCP` 将配置文件(`core-site.xml、hdfs-site.xml、mapred-site.xml、yarn-site.xml`)上传至 `etc/hadoop` 目录下

# 尝试使用

- 格式化文件系统

```bash
hdfs namenode -format
```

- 启动和终止守护进程

```bash
start-dfs.sh
start-yarn.sh
mapred --daemon start historyserver
```

- 创建用户目录

```bash
hadoop fs -mkdir -p user/$USER
```

- 将本地文件复制到HDFS

```bash
hadoop fs -copyFromLocal hadoop-book/input/docs/quangle.txt \ hdfs://localhost/user/username/quangle.txt
```

- 将文件复制回本地文件系统并检查是否一致

```bash
hadoop fs -copyToLocal quangle.txt quangle.copy.txt
md5sum hadoop-book/input/docs/quangle.txt quangle.copy.txt
```
