#!/usr/bin/env node
const chalk = require('chalk');
const { exec } = require('child_process');
const { eslintConfig, prettierConfig } = require('./configs');
const fs = require('fs');
const inquirer = require('inquirer');
const npmAddScript = require('npm-add-script');

const tmpPackagesFileName = `${Math.random().toString(36).substr(2, 16)}.json`;

const execute = async () => {
  // Create files
  createFile('.eslintrc.json', JSON.stringify(eslintConfig))
    .then(() => (!hasPrettierConfig() ? createFile('.prettierrc.json', JSON.stringify(prettierConfig)) : null))
    //install packages
    .then(() => installPackages(getPackagesToInstall()))
    // add script?
    .then(() => askQuestion('ADDSCRIPTS', 'Add linting scripts?').then((response) => (response ? addScripts() : null)))
    //uninstall tslint?
    .then(() =>
      askQuestion('UNINSTALLTSLINT', 'Uninstall tslint and related packages?').then((response) =>
        response ? getTslintInstalledPackageNames().then((names) => installPackages(names, true)) : null
      )
    )
    //delete tslint config file
    .then(() =>
      askQuestion('DELETETSLINTCONFIG', 'Delete tslint configuration file?').then((response) => (response ? deleteFile('tslint.json') : null))
    )
    .catch((err) => console.log(err));
};

const askQuestion = async (name, message) => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: name,
          message: `${message} (Y/N)`,
          choices: ['Y', 'N'],
        },
      ])
      .then((answers) => {
        resolve(answers[name].toLowerCase() === 'y');
      });
  });
};

const createFile = (fileName, fileContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, fileContent, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(chalk.green(`${fileName} was created successfully`));
      resolve();
    });
  });
};

const deleteFile = (fileName, logSuccess = true) => {
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (logSuccess) {
        console.log(chalk.green(`${fileName} was deleted successfully`));
      }
      resolve();
    });
  });
};

const addScripts = () => {
  console.log(chalk.yellowBright('---    /adding scripts/    ---'));
  const eslintScript = {
    key: 'eslint:fix',
    value: 'eslint --ignore-path .gitignore --quiet --fix --ext .jsx,.ts,.tsx src/',
  };
  const prettierScript = {
    key: 'prettier:fix',
    value: 'prettier src/**/*.{js,ts,jsx,tsx} --write',
  };
  return new Promise((resolve, reject) => {
    npmAddScript({ ...eslintScript, force: true });
    npmAddScript({ ...prettierScript, force: true });
    console.log('Two scripts were added to your package.json file:');
    console.log(eslintScript);
    console.log(prettierScript);
    resolve();
  });
};

const installPackages = (packagesArray, uninstall = false) => {
  console.log(chalk.yellowBright(`---    /${uninstall ? 'un' : ''}installing packages/    ---`));
  console.log(chalk.blueBright(`Packages to ${uninstall ? 'un' : ''}install: ${packagesArray.join(' ')}`));
  return new Promise((resolve, reject) => {
    console.log('Please wait...');
    exec(`npm ${uninstall ? 'un' : ''}install -D ${packagesArray.join(' ')}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(stdout);
      console.log(chalk.green(`Packages ${uninstall ? 'un' : ''}installed successfully`));
      resolve();
    });
  });
};

const getPackagesToInstall = () => {
  return [
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-plugin-sort-imports-es6-autofix',
  ];
};
const getTslintInstalledPackageNames = () => {
  let tslintPs = [];
  return new Promise((resolve, reject) => {
    exec(`npm  ls --depth=0 --json --silent > ${tmpPackagesFileName}`, (err, stdout, stderr) => {
      const installedPackages = fs.readFileSync(tmpPackagesFileName);
      if (JSON.parse(installedPackages)) {
        const depedencies = JSON.parse(installedPackages).dependencies;
        tslintPs = Object.keys(depedencies).filter((d) => d.includes('tslint'));
        deleteFile(tmpPackagesFileName, false);
        resolve(tslintPs);
      } else if (err) {
        console.error(err);
        reject(err);
      }
      reject();
    });
  });
};
const hasPrettierConfig = () => {
  return fs.readdirSync('./').filter((f) => f.includes('prettier')).length > 0;
};

execute();
