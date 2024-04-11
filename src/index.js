#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { program } = require('commander');
const {
  getcurrentRegistry,
  setRegistry,
  sourcesWrite
} = require('./utils/index');
const { DEFAULT_REGISTRY } = require('./constant/index');
const { log } = require('./utils/log');

const sources = require('./public/sources.json');
const warehouse = require('./public/warehouse.json')

const paths = path.join(__dirname, '../', './package.json');
const file = JSON.parse(fs.readFileSync(paths));
const currentResource = getcurrentRegistry().toString().trim();

program.version(file.version, '-v', '查看版本号');

program
  .command('current')
  .alias('c')
  .description('查看当前镜像源')
  .action(async () => {
    const item = sources.find((item) => item.value == currentResource);
    log.info(`${item.name}: ${item.value}`);
  });

program
  .command('list')
  .alias('ls')
  .description('查看所有镜像源')
  .action(() => {
    sources.forEach((item) => {
      let log = '';
      const str = `${item.name}: ${item.value} ${log}`;
      if (currentResource === item.value) {
        log = chalk.green(` * ${str + '(Currently using)'}`);
      } else {
        log = `   ${str}`;
      }
      console.log('\n', log);
    });
  });

program
  .command('use [name]')
  .description('使用某个镜像源')
  .action((name) => {
    if (!name) {
      return log.error('请按照规定格式使用镜像源，<nrs use 镜像源名称>');
    }
    const data = sources.find((item) => item.name === name);
    if (!data) {
      return log.error('该镜像源名称不存在');
    }
    setRegistry(data.value);
    log.success(`${data.name}：${data.value}`);
  });

program
  .command('add')
  .alias('a')
  .description('新增镜像源')
  .action(() => {
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: '镜像源名称:'
        },
        {
          name: 'url',
          type: 'input',
          message: '镜像源地址:'
        }
      ])
      .then(async (item) => {
        if (!item.name) {
          return log.error('镜像源名称不能为空');
        }
        if (!item.url) {
          return log.error('镜像源地址不能为空');
        }

        const index = sources.findIndex((data) => data.name == item.name);
        if (index > -1) {
          return log.error('镜像源名称已存在');
        }

        if (!item.url.endsWith('/')) item.url = item.url + '/';

        const index2 = sources.findIndex((data) => data.value == item.url);
        if (index2 > -1) {
          return log.error('镜像源地址已存在');
        }

        sources.push({
          name: item.name,
          value: item.url
        });

        await sourcesWrite(sources);
        log.success('新增成功');
      });
  });

program
  .command('del [name]')
  .alias('d')
  .description('删除镜像源')
  .action((name) => {
    inquirer
      .prompt([
        {
          name: 'isDel',
          type: 'confirm',
          message: '确认删除吗'
        }
      ])
      .then(async (res) => {
        if (!name) return log.error('请按照规定格式删除镜像源，<nrs del 镜像源名称>')
        if (res.isDel) {
          const index = sources.findIndex((data) => data.name == name);
          if (index > -1) {
            const item = sources.find((item) => item.value == currentResource);
            const item1 = sources[index];
            if (item1.name == item.name) {
              log.error('不能删除当前使用的镜像源');
            } else {
              sources.splice(index, 1);
            }
          }
          await sourcesWrite(sources);
          log.success('删除成功')
        }
      });
  });

program
  .command('checkout')
  .description('切换镜像源')
  .action(async () => {
    inquirer
      .prompt([
        {
          name: 'registry',
          type: 'list',
          message: '请选择镜像源',
          choices: sources
        }
      ])
      .then(async (res) => {
        setRegistry(res.registry);
        log.success('切换成功');
      });
  });

program
  .command('update')
  .alias('u')
  .description('更新镜像源')
  .action(async () => {
    inquirer
      .prompt([
        {
          name: 'registry',
          type: 'list',
          message: '请选择镜像源',
          choices: sources
        },
        {
          name: 'name',
          type: 'input',
          message: '请输入要更新的镜像源名称(非必填)'
        },
        {
          name: 'url',
          type: 'input',
          message: '请输入要更新的镜像源地址(非必填)'
        }
      ])
      .then(async (res) => {
        const index = sources.findIndex((data) => data.value == res.registry);
        const item = sources[index];
        const lastIndex = res.registry.lastIndexOf('/');
        if (lastIndex > -1) {
          const url = res.registry.split('');
          url.splice(lastIndex, 1);
          res.registry = url.join('');
        }
        item.name = res.name ? res.name : item.name;
        item.value = res.registry ? res.registry + '/' : item.value;

        await sourcesWrite(sources);
        log.success('更新成功');
      });
  });

program
  .command('reset')
  .alias('r')
  .description('恢复默认镜像源')
  .action(() => {
    inquirer
      .prompt([
        {
          name: 'isReset',
          type: 'confirm',
          message: '确认恢复默认镜像源吗[npm]'
        }
      ])
      .then((res) => {
        if (res.isReset) {
          setRegistry(DEFAULT_REGISTRY);
          log.success('恢复成功');
        }
      });
  });

program
  .command('store')
  .description('查看镜像源仓库')
  .action(() => {
    warehouse.forEach(item => {
      log.info(`${item.name}: ${item.value}`)
    })
  })

program.parse(process.argv);
