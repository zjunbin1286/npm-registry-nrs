#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { program } = require('commander');
const action = require('./action.js')
const paths = path.join(__dirname, '../', './package.json');
const file = JSON.parse(fs.readFileSync(paths));

program.version(file.version, '-v', '查看版本号');

program
  .command('current')
  .alias('c')
  .description('查看当前镜像源')
  .action(action.currentAction);

program
  .command('list')
  .alias('ls')
  .description('查看所有镜像源')
  .action(action.listAction);

program
  .command('use [name]')
  .description('使用某个镜像源')
  .action(action.useAction);

program
  .command('checkout')
  .description('切换镜像源')
  .action(action.checkoutAction);

program
  .command('add')
  .alias('a')
  .description('新增镜像源')
  .action(action.addAction);

program
  .command('update')
  .alias('u')
  .description('更新镜像源')
  .action(action.updateAction);

program
  .command('del [name]')
  .alias('d')
  .description('删除镜像源')
  .action(action.delAction);

program
  .command('reset')
  .alias('r')
  .description('恢复默认镜像源')
  .action(action.resetAction);

program
  .command('store')
  .description('查看镜像源仓库')
  .action(action.storeAction)

program
  .command('ping [name]')
  .description('检测镜像源速度')
  .action(action.pingAction)

program
  .command('store-use [name]')
  .description('使用镜像源仓库的某个镜像源')
  .action(action.storeUseAction)


program.parse(process.argv);
