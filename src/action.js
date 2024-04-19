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
    return log.error('Missing name，<nrs use [name]>');
  }
  const data = sources.find((item) => item.name === name);
  if (!data) {
    return log.error('The mirror source does not exist');
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
        message: 'Please select',
        choices: sources
      }
    ])
    .then(async (res) => {
      setRegistry(res.registry);
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
        message: 'name:'
      },
      {
        name: 'url',
        type: 'input',
        message: 'source:'
      }
    ])
    .then(async (item) => {
      if (!item.name) {
        return log.error('The name cannot be empty');
      }
      if (!item.url) {
        return log.error('The url cannot be empty');
      }

      const index = sources.findIndex((data) => data.name == item.name);
      if (index > -1) {
        return log.error('The name already exists');
      }

      if (!item.url.endsWith('/')) item.url = item.url + '/';

      const index2 = sources.findIndex((data) => data.value == item.url);
      if (index2 > -1) {
        return log.error('The url already exists');
      }

      sources.push({
        name: item.name,
        value: item.url
      });

      await sourcesWrite(sources);
      log.success('Successfully added, can be viewed through command ls');
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
        message: 'Please select',
        choices: sources
      },
      {
        name: 'name',
        type: 'input',
        message: 'Enter new name(optional)'
      },
      {
        name: 'url',
        type: 'input',
        message: 'Enter new url(optional)'
      }
    ])
    .then(async (res) => {
      const index = sources.findIndex((data) => data.value == res.registry);
      const item = sources[index];

      if (res.url && !res.url.endsWith('/')) res.url = res.url + '/';

      item.name = res.name ? res.name : item.name;
      item.value = res.url ? res.url : item.value;

      await sourcesWrite(sources);
      log.success('Successfully updated, can be viewed through command ls');
    });
}

/**
 * * 7.删除镜像源
 * @param {String} name 镜像名称
 */
function delAction(name, { isDel }) {
  const delSource = (name) => {
    const index = sources.findIndex((data) => data.name == name);
    if (index > -1) {
      const item = sources.find((item) => item.value == currentResource);
      const item1 = sources[index];
      if (item1.name == item.name) {
        log.error('Cannot delete the currently used mirror source');
      } else {
        sources.splice(index, 1);
        sourcesWrite(sources);
        log.success('Successfully deleted, can be viewed through command ls')
      }
    } else {
      log.error('The mirror source does not exist');
    }
  }
  if (isDel) {
    if (!name) return log.error('Missing name, <nrs del [name] -d>')
    delSource(name)
  } else {
    inquirer
      .prompt([
        {
          name: 'confirm',
          type: 'confirm',
          message: 'Are you sure to delete it?'
        }
      ])
      .then(async (res) => {
        if (!name) return log.error('Missing name, <nrs del [name]>')
        if (res.confirm) {
          delSource(name)
        }
      });
  }
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
        message: 'Are you sure to restore the default mirror source[npm]'
      }
    ])
    .then((res) => {
      if (res.isReset) {
        setRegistry(DEFAULT_REGISTRY);
        log.success('Successfully reset, can be viewed through command ls');
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
      log.info(`Response time: ${time}ms`)
    }).catch(() => {
      log.info("Response timeout")
    })
  }
  if (name) {
    const source = sources.find(item => item.name === name)
    if (!source) return log.error('The mirror source does not exist')
    const url = source.value
    testTimeFn(url)
  } else {
    const options = {
      type: 'list',
      name: 'source',
      message: 'Please select:',
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
    if (!source) return log.error('The mirror source does not exist in the store')
    setRegistry(source.value);
    log.success(`${source.name}: ${source.value}`);
  } else {
    log.error('Missing name, <nrs store-use [name]>')
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