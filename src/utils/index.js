const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { SOURCES_PATH } = require('../constant/index');

const getcurrentRegistry = () => {
  return execSync('npm config get registry');
};

const setRegistry = (url) => {
  return execSync(`npm config set registry ${url}`);
};

/**
 * 写入数据
 * @param {Array} sources
 */
const sourcesWrite = async (sources) => {
  return new Promise((resolve, rejects) => {
    const filePath = path.join(__dirname, SOURCES_PATH);
    fs.promises.writeFile(filePath, JSON.stringify(sources));
    resolve(true);
  });
};

module.exports = {
  getcurrentRegistry,
  setRegistry,
  sourcesWrite
};
