# npm-registry-nrs
📦 npm-registry-nrs 是一个 npm 源管理器，允许你快速地在 npm 源间切换，并且支持通过增删改查等管理镜像源。

npm-registry-nrs is an NPM source manager that allows you to quickly switch between NPM sources and supports managing image sources through addition, deletion, modification, and querying.

## Install
```shell
# npm
npm i -g npm-registry-nrs

# yard
yarn add -g  npm-registry-nrs
```

## Usage
```
nrs current 查看当前镜像源（简写 nrs c）

nrs list 查看所有镜像源（简写 ls）

nrs use <name> 使用某个镜像源

nrs checkout 选择镜像源并切换

nrs add 新增镜像源（简写 nrs a）

nrs update 更新镜像源（简写 nrs u）

nrs del <name> 删除镜像源（简写 nrs d <name>）

nrs reset 恢复默认镜像源

nrs store 查看提供的镜像源仓库

nrs store-use 使用镜像源仓库中的镜像

nrs ping <name> 测试镜像响应速度
```

## License
Checkout out [MIT](https://github.com/zjunbin1286/npm-registry-nrs/blob/main/LICENSE)
