# npm-registry-nrs
[![NPM version][npm-image]][npm-url]


📦 npm-registry-nrs is an NPM source manager that allows you to quickly switch between NPM sources and supports managing image sources through addition, deletion, modification, and querying.

npm-registry-nrs 是一个 npm 源管理器，允许你快速地在 npm 源间切换，并且支持通过增删改查等管理镜像源。


## Install
```shell
# npm
npm i -g npm-registry-nrs

# yarn
yarn add -g  npm-registry-nrs
```

## Example
```shell
$ nrs current
npm: https://registry.npmjs.org/

$ nrs use cnpm
[success] cnpm：https://r.cnpmjs.org/

$ nrs reset
? Are you sure to restore the default mirror source[npm] Yes
[success] Successfully reset, can be viewed through command ls
```

## Usage
```shell
Usage: index [options] [command]

Options:
  -v                      View version（查看版本号）
  -h, --help              display help for command

Commands:
  current|c               View the current mirror source（查看当前镜像源）
  list|ls                 View all mirror sources（查看所有镜像源）
  use [name]              Using a certain mirror source（使用某个镜像源）
  checkout                Switching Mirror Sources（切换镜像源）
  add|a                   Add mirror source（新增镜像源）
  update|u                Update mirror source（更新镜像源）
  del|d [options] [name]  Delete mirror source（删除镜像源）
  reset|r                 Restore default mirror source（恢复默认镜像源）
  store                   View mirror Source Warehouse（查看镜像源仓库）
  ping [name]             Detecting mirror Source Speed（检测镜像源速度）
  store-use [name]        Using a certain mirror source from the mirror source repository（使用镜像源仓库的某个镜像源）
  help [command]          display help for command
```

## Detail
```
Force deletion of mirror source（强制删除镜像源）
# nrs del [name] -d
```

## Changelog
Detailed changes for each release are documented in the [CHANGELOG](https://github.com/zjunbin1286/npm-registry-nrs/blob/main/CHANGELOG.md).

## License
Checkout out [MIT](https://github.com/zjunbin1286/npm-registry-nrs/blob/main/LICENSE)

[npm-image]: https://img.shields.io/badge/npm-v1.1.3-blue
[npm-url]: https://www.npmjs.com/package/npm-registry-nrs