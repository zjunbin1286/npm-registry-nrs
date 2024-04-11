# npm-registry-nrs
npm-registry-nrs 是一个 npm 源管理器，允许你快速地在 npm 源间切换，支持新增修改删除等

## 安装
```shell
# npm
npm i -g npm-registry-nrs

#yard
yarn add -g  npm-registry-nrs
```

## 使用
```
nrs current 查看当前镜像源（简写 nrs c）

nrs list 查看所有镜像源（简写 ls）

nrs use <name> 使用某个镜像源

nrs checkout 选择镜像源并切换

nrs add 新增镜像源（简写 nrs a）

nrs update 更新镜像源（简写 nrs u）

nrs del <name> 删除镜像源（简写 nrs d <name>）

nrs reset 恢复默认镜像源
```

## License
Checkout out [MIT](https://github.com/zjunbin1286/npm-registry-nrs/blob/main/LICENSE)
