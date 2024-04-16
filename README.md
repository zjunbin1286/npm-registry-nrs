# npm-registry-nrs
[![NPM version][npm-image]][npm-url]

📦 npm-registry-nrs 是一个 npm 源管理器，允许你快速地在 npm 源间切换，并且支持通过增删改查等管理镜像源。

npm-registry-nrs is an NPM source manager that allows you to quickly switch between NPM sources and supports managing image sources through addition, deletion, modification, and querying.

## Install
```shell
# npm
npm i -g npm-registry-nrs

# yard
yarn add -g  npm-registry-nrs
```

## Example
```shell
$ nrs current
npm: https://registry.npmjs.org/

$ nrs use cnpm
[success] cnpm：https://r.cnpmjs.org/

$ nrs reset
? 确认恢复默认镜像源吗[npm] Yes
[success] 恢复成功
```

## Detail
```
nrs current 查看当前镜像源（简写 nrs c）

nrs list 查看所有镜像源（简写 ls）

nrs use <name> 使用某个镜像源

nrs checkout 选择镜像源并切换

nrs add 新增镜像源（简写 nrs a）

nrs update 更新镜像源（简写 nrs u）

nrs del <name> 删除镜像源（二次确认）（简写 nrs d <name>）

nrs del <name> -d 强制删除镜像源（简写 nrs d <name> -d）

nrs reset 恢复默认镜像源

nrs store 查看提供的镜像源仓库

nrs store-use 使用镜像源仓库中的镜像

nrs ping <name> 测试镜像响应速度
```

## Usage
```shell
Usage: index [options] [command]

Options:
  -v                      查看版本号（View version）
  -h, --help              display help for command

Commands:
  current|c               查看当前镜像源（View the current mirror source）
  list|ls                 查看所有镜像源（View all mirror sources）
  use [name]              使用某个镜像源（Using a certain mirror source）
  checkout                切换镜像源（Switching Mirror Sources）
  add|a                   新增镜像源（Add mirror source）
  update|u                更新镜像源（Update mirror source）
  del|d [options] [name]  删除镜像源（delete mirror source）
  reset|r                 恢复默认镜像源（Restore default mirror source）
  store                   查看镜像源仓库（View mirror Source Warehouse）
  ping [name]             检测镜像源速度（Detecting mirror Source Speed）
  store-use [name]        使用镜像源仓库的某个镜像源（Using a certain mirror source from the mirror source repository）
  help [command]          display help for command
```

## License
Checkout out [MIT](https://github.com/zjunbin1286/npm-registry-nrs/blob/main/LICENSE)

[npm-image]: https://img.shields.io/badge/npm-v1.0.5-blue
[npm-url]: https://www.npmjs.com/package/npm-registry-nrs