// ciri-create my-app 创建 my-app 项目
// 设定参数，--use-npm --use-yarn --template 选择项目配置模版 安装方式 安装哪种模版
// 1. 校验my-app 名称合法性，
// 2. 判断安装方式，测试源，网络链接性
// 3. 判断模版是否可用，
// 4. 开始安装模版
// 5. 生成文件目录

// 模版 pure-react-app 无外部组件库，无组件库，自定义less
// 模版 admin-react-app 中后台项目，引入 antd
// 模版 mobile-react-app 移动端项目，引入antd-mobile 

const commander = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const validateProjectName = require('validate-npm-package-name');

const { execSync, spawnSync } = require('child_process');

const packageJson = require('./package.json');

let projectName = '';

function appInit() {
  const program = new commander.Command(packageJson.name);
  program
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
      projectName = name
    })
    .option('--use-yarn', 'User npm to install.')
    .option('--template <template-name>', 'Project Template for the created.', 'admin-react-app')
    .parse(process.argv);

  if(projectName === '') {
    logError('Please specify the project directory: ');
    console.log(`    ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
    process.exit(1);
  }

  appCreate(projectName, program.template, program.useYarn);
}

function appCreate(name, templateName, useYarn) {
  const projectRoot = path.resolve(name);
  const appName = path.basename(projectRoot);

  // 校验 projectName 是否可用 这里不使用 promise 不需要值传递，非异步，错误处理无统一性
  checkNodeVersion(); // 检查 node 版本
  checkAppName(appName); // 检查 appName 是否合法
  checkSafeToCreateProject(projectRoot, appName); // 检查如果创建目录是否会引起冲突

  // 校验 安装工具
  if(useYarn) {
    checkYarnRegistry();
  }else {
    checkNpmVersion();
  }

  // 校验 模版 是否可用
  checkTemplate(templateName);

  // 创建目录，复制项目，执行 npm install
  run(projectRoot, appName, templateName, useYarn);
}

function run(projectRoot, appName, templateName, useYarn) {
  // 寻找 模版 完成 copy
  const templatePath = path.join(path.resolve(__dirname),'ciri-template', templateName);
  console.log(chalk.green('Template: admin-react-app Downloading...\n'));

  copyDirectory(templatePath, projectRoot)
    .then(() => {
      console.log(chalk.green('\nTemplate Download Successful!\n'));
      // 根据指定包工具 完成 安装
      // packageInstall();
    }, (err) => {
      logError(`\nTemplate Download failed!\n${err}`);
      process.exit(1);
    })
}

function checkNodeVersion() {
  const currentNodeVerison = process.versions.node;
  const versions = currentNodeVerison.split('.');
  const major = versions[0];

  if(major < 14) {
    logError(`Curren Node Version is ${currentNodeVerison}.\nPlease update your version of node to 14 or higher`);
    process.exit(1);
  }
}

function checkAppName(appName) {
  const validateRes = validateProjectName(appName);

  if (!validateRes.validForNewPackages) {
    logError(`Can't create project by "${appName}".`);

    (validateRes.errors || []).forEach(error => {
      logError(`   * ${error}`);
    });
    (validateRes.warnings || []).forEach(warning => {
      logWarn(`    Warning: ${warning}`);
    });
    logError(`\nPlease choose new project name.`);
    process.exit(1);
  }
}

function checkSafeToCreateProject(projectRoot, appName) {
  const validateFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.idea',
    '.npmignore',
    'docs',
    'LICENSE',
    'README.md'
  ];

  const errorLogFilePatterns = [
    'npm-debug.log',
    'yarn-error.log',
    'yarn-debug.log',
  ];

  const isErrorLog = (file) => errorLogFilePatterns.some(pattern => file.startsWith(pattern));
  
  const projectIsExist = fs.existsSync(projectRoot);
  if(!projectIsExist) {
    return;
  }

  const conflicts = fs.readdirSync(projectRoot)
    .filter(file => !validateFiles.includes(file))
    .filter(file => !isErrorLog(file));

  if(conflicts.length > 0) {
    logWarn(`The directory ${chalk.green(appName)} contains files that could conflict: \n`);
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(projectRoot, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(`${file}/`)}`);
        } else {
          console.log(`  ${file}`);
        }
      } catch (e) {
        console.log(`  ${file}`);
      }
    }
    process.exit(1);
  }

  // remove 
  fs.readdirSync(projectRoot).forEach(file => {
    if (isErrorLog(file)) {
      fs.removeSync(path.join(projectRoot, file));
    }
  });
  return;
}

function checkNpmVersion() {
  let npmVersion = '';
  try {
    npmVersion = execSync('npm --version').toString().trim();
  } catch (err) { 

  }
  const major = npmVersion.split('.')[0];
  if(major < 6) {
    logError(`Curren Npm Version is ${npmVersion}.\nPlease update your version of npm to 6 or higher`);
    process.exit(1);
  }
}

function checkYarnRegistry() {
  let yarnUsesDefaultRegistry = 'https://registry.yarnpkg.com';
  let isDefaultRegistry = true;
  try {
    isDefaultRegistry = execSync('yarnpkg config get registry').toString().trim() === yarnUsesDefaultRegistry;
  } catch(err) {

  }
  if(!isDefaultRegistry) {
    process.exit(1);
  }
}

function checkTemplate(templateName) {
  const templates = ['pure-react-app', 'admin-react-app', 'mobile-react-app'];

  if(!templates.includes(templateName)) {
    logError(`There are no template-project ${templateName} to support.\n`);
    console.log(`Please select one of them: ${templates.join(',')}\n`);
    process.exit(1);
  }
}

function copyDirectory(src, tgt) {
  const mkdirPromise = new Promise((resolve) => {
    const isTgtExists = fs.existsSync(tgt);
    if(!isTgtExists) {
      fsPromises.mkdir(tgt).then(resolve)
    }else {
      resolve();
    }
  })

  return mkdirPromise
    .then(() => fsPromises.readdir(src))
    .then(files => {
      return files.reduce((prev, file) => {
        return prev.then(() => {
          const target = path.join(tgt, file);
          const source = path.join(src, file);
          return fsPromises.lstat(source).then((stat) => {
            if(stat.isDirectory()) {
              return copyDirectory(source, target);
            }else {
              console.log(chalk.yellow(`  Generating files: ${target}`));
              fs.createReadStream(source).pipe(fs.createWriteStream(target))  
            }
          })
        })
      }, Promise.resolve());
    })
}

function logError(err) {
  console.error(chalk.red(err));
}

function logWarn(warning) {
  console.log(chalk.yellow(warning));
}

module.exports = appInit;