#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import yargs from 'yargs';

import Dokata from './';
import pkg from '../package.json';

const argv = yargs
  .usage('Usage: dokata [options] <template_path>')
  .example('dokata /path/to/template', 'extract template to current dir.')
  .example('dokata -o /path/to/output /path/to/template', 'extract template to output dir.')
  .option('o', {
    alias: 'output-dir',
    describe: 'Set output directory path',
    type: 'string',
    'default': '.'
  })
  .help('help')
  .demand(1)
  .version(pkg.version)
  .detectLocale(false)
  .strict()
  .wrap(null)
  .argv;


/**
 * execute
 *
 * @param {string} baseDir dokata template path
 * @param {Object} options command line options
 */
function execute(baseDir, options) {
  const dokata = new Dokata(baseDir, options);
  inquirer.prompt(dokata.config.questions, answers => {
    dokata.updateContext(answers);
    dokata.on('create:file', filepath => {
      console.log(`${chalk.gray('file')}:\t${chalk.bold(filepath)}`);
    })
    .on('create:dir', dirpath => {
      console.log(`${chalk.gray('dir')}:\t${chalk.bold(dirpath)}`);
    })
    .on('done', () => {
      console.log(chalk.green.bold('Success!'));
      process.exit();
    })
    .execute();
  });
}

execute(argv._[0], argv);
