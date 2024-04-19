const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');
const minimist = require('minimist');
const semver = require('semver');
const path = require('path');
const fs = require('fs-extra');

// 解析命令行参数
const args = minimist(process.argv.slice(2));
// 是否是 dry 模式。dry 模式下只会展示命令，不会真正执行命令，用来测试。
const isDry = args.dry;

const versionIncrements = ['patch', 'minor', 'major'];
const pkg = require('../../package.json');
const currentVersion = pkg.version;

// 测试运行
const dryRun = (bin, args) => {
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`));
  return;
};

// 立即运行
const directRun = (bin, args) => {
  // console.log(chalk.blue(`[directRun] ${bin} ${args.join(' ')}`));
  // return;
  return execa(bin, args, { stdio: 'inherit' });
};

const run = isDry ? dryRun : directRun;

const step = (msg) => console.log(chalk.cyan(msg));

// 更新 package.json 中的 version 字段
function updateVersion(version) {
  pkg.version = version;
  fs.writeFileSync(
    path.resolve(__dirname, '../../package.json'),
    JSON.stringify(pkg, null, 2)
  );
}

async function main() {
  // 1. 确定变动版本级别 `patch | minor | major`，遵循 semver 规范。
  const { release } = await inquirer.prompt([
    {
      name: 'release',
      type: 'list',
      message: 'Select release type',
      choices: versionIncrements.map(
        (i) => `${i} (${semver.inc(currentVersion, i)})`
      )
    }
  ])

  const targetVersion = release.match(/\((.*)\)/)[1];

  // 2、二次确认
  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: `Releasing ${targetVersion}. Confirm?`
  });
  if (!confirm) return

  // 3. 自动修改包版本
  if (!isDry) {
    step('\nUpdate version...');
    updateVersion(targetVersion);
  }

  // 4. 生成 CHANGELOG.md（后面会补充 changelog 命令）
  step('\nGenerating changelog...');
  await run('npm', ['run', 'changelog']);

  // 5. 生成 release commit
  step('\nCommitting changes...');
  await run('git', ['add', '-A']);
  await run('git', ['commit', '-m', `feat: v${targetVersion}`]);

  // 6. 执行 npm publish
  step('\nPublishing packages...');
  await run('npm', ['publish', '--access', 'public']);

  // 7. git push 并打 tag
  step('\nPushing to GitHub...');
  await run('git', ['tag', `v${targetVersion}`]);
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);

}

main().catch((err) => {
  // 错误兜底处理，回退版本
  console.log(err);
  updateVersion(currentVersion);
});