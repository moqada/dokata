#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';

import Dokata from './';
import pkg from '../package.json';

updateNotifier({pkg}).notify();

const argv = yargs
  .usage('Usage: dokata [options] <generator_path>')
  .example('dokata /path/to/generator', 'extract template to current dir.')
  .example('dokata -o /path/to/output /path/to/generator', 'extract template to output dir.')
  .example('dokata generator_name', 'extract template to current dir (MUST: $DOKATA_TEMPLATE_DIR).')
  .example('dokata -l', 'Listing template names (MUST: $DOKATA_TEMPLATE_DIR).')
  .option('o', {
    alias: 'output-dir',
    describe: 'Set output directory path',
    type: 'string',
    'default': '.'
  })
  .option('l', {
    alias: 'list',
    describe: 'Listing template names'
  })
  .help('help')
  .version(pkg.version)
  .detectLocale(false)
  .strict()
  .wrap(null)
  .argv;


/**
 * Generate project
 *
 * @param {string} name generator name
 * @param {Object} options options
 */
function generateProject(name, options) {
  const dokata = new Dokata(process.env.DOKATA_TEMPLATE_DIR);
  const generator = dokata.createGenerator(name);
  if (generator === null) {
    throw new Error(`Does not exist generator: ${name}`);
  }
  inquirer.prompt(generator.config.questions, answers => {
    generator.updateContext(answers);
    generator.on('create:file', filepath => {
      console.log(`${chalk.gray('file')}:\t${chalk.bold(filepath)}`);
    })
    .on('create:dir', dirpath => {
      console.log(`${chalk.gray('dir')}:\t${chalk.bold(dirpath)}`);
    })
    .on('done', () => {
      console.log(chalk.green.bold('Success!'));
      process.exit();
    })
    .execute(options.outputDir);
  });
}


/**
 * List generator names
 */
function listGeneratorNames() {
  if (!process.env.DOKATA_TEMPLATE_DIR) {
    console.error(chalk.red('Please set DOKATA_TEMPLATE_DIR'));
    process.exit(1);
  }
  const dokata = new Dokata(process.env.DOKATA_TEMPLATE_DIR);
  dokata.getGeneratorConfigs().forEach(config => console.log(config.name));
  process.exit();
}


/**
 * execute
 *
 * @param {string[]} args command line arguments
 * @param {Object} options command line options
 */
function execute(args, options) {
  try {
    if (options.list) {
      listGeneratorNames();
    } else if (args.length > 0) {
      generateProject(args[0], options);
    } else {
      throw new Error('Please set generator name');
    }
  } catch (e) {
    console.error(chalk.red(e));
    process.exit(1);
  }
}

execute(argv._, argv);
