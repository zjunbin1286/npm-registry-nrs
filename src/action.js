const chalk = require('chalk');
const inquirer = require('inquirer');
const HttpPing = require('node-http-ping');
const {
  getcurrentRegistry,
  setRegistry,
  sourcesWrite
} = require('./utils/index');
const { DEFAULT_REGISTRY } = require('./constant/index');
const { log } = require('./utils/log');

const sources = require('./public/sources.json');
const warehouse = require('./public/warehouse.json')
const currentResource = getcurrentRegistry().toString().trim();

/**
 * * 1.查看当前镜像源
 */
function currentAction() {
  const item = sources.find((item) => item.value == currentResource);
  log.info(`${item.name}: ${item.value}`);
}

/**
 * * 2.查看所有镜像源
 */
function listAction() {
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
}

/**
 * * 3.使用某个镜像源
 * @param {String} name  镜像名称 
 */
function useAction(name) {
  if (!name) {
    return log.error('请按照规定格式使用镜像源，<nrs use 镜像源名称>');
  }
  const data = sources.find((item) => item.name === name);
  if (!data) {
    return log.error('该镜像源名称不存在');
  }
  setRegistry(data.value);
  log.success(`${data.name}：${data.value}`);
}

/**
 * * 4.切换镜像源
 */
function checkoutAction() {
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
}

/**
 * * 5.新增镜像源
 */
function addAction() {
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
}

/**
 * * 6.更新镜像源
 */
function updateAction() {
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
        message: '请输入新的镜像源名称(选填)'
      },
      {
        name: 'url',
        type: 'input',
        message: '请输入新的镜像源地址(选填)'
      }
    ])
    .then(async (res) => {
      const index = sources.findIndex((data) => data.value == res.registry);
      const item = sources[index];

      if (res.url && !res.url.endsWith('/')) res.url = res.url + '/';

      item.name = res.name ? res.name : item.name;
      item.value = res.url ? res.url : item.value;

      await sourcesWrite(sources);
      log.success('更新成功');
    });
}

/**
 * * 7.删除镜像源
 * @param {String} name 镜像名称
 */
function delAction(name) {
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
}

/**
 * * 8.恢复默认镜像源
 */
function resetAction() {
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
}

/**
 * * 9.查看镜像源仓库
 */
function storeAction() {
  warehouse.forEach(item => {
    log.info(`${item.name}: ${item.value}`)
  })
}

/**
 * * 10.检测镜像源响应速度
 * @param {String} name 镜像名称 
 */
function pingAction(name) {
  const testTimeFn = (url) => {
    const testUrl = url.slice(0, url.length - 1)
    HttpPing(testUrl).then(time => {
      log.info(`响应时间：${time}ms`)
    }).catch(() => {
      log.info("响应超时")
    })
  }
  if (name) {
    const source = sources.find(item => item.name === name)
    if (!source) return log.error('该镜像源不存在')
    const url = source.value
    testTimeFn(url)
  } else {
    const options = {
      type: 'list',
      name: 'source',
      message: '请选择要测速的源:',
      choices: sources,
    };

    inquirer.prompt(options).then(res => {
      testTimeFn(res.source)
    });
  }
}

/**
 * * 11.使用镜像源仓库的某个镜像源
 * @param {*} res 
 */
function storeUseAction(name) {
  if (name) {
    const source = warehouse.find(item => item.name === name)
    if (!source) return log.error('该源不存在')
    setRegistry(source.value);
    log.success(`${source.name}：${source.value}`);
  } else {
    log.error('请按照规定格式使用仓库镜像源，<nrs store-use 镜像源名称>')
  }
}

module.exports = {
  currentAction,
  listAction,
  useAction,
  checkoutAction,
  addAction,
  updateAction,
  delAction,
  resetAction,
  storeAction,
  pingAction,
  storeUseAction
}