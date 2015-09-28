import {EventEmitter} from 'events';
import path from 'path';

import debugModule from 'debug';
import ejs from 'ejs';
import fs from 'fs-extra';
import walk from 'walk';

const debug = debugModule('dokata');
const CONFIG_FILE_NAME = 'dokata.json';
const TEMPLATE_DIR_NAME = 'template';


/**
 * Project Generator
 */
export default class Dokata extends EventEmitter {

  /**
   * Constructor
   *
   * @param {string} baseDir dokata template directory path
   * @param {Object} options options
   */
  constructor(baseDir, options) {
    super();
    debug('baseDir', baseDir);
    debug('options', options);
    this.baseDir = baseDir;
    this.templateDir = path.join(baseDir, TEMPLATE_DIR_NAME);
    this.outputDir = path.resolve(options.outputDir);
    this.context = options.context || {};
    this.options = options;
    this.loadConfig();
  }

  /**
   * Generate files from settings of dokata template
   */
  execute() {
    const walker = walk.walk(this.templateDir);

    fs.mkdirs(this.outputDir);

    walker.on('directories', (root, stats, next) => {
      const basePath = path.relative(this.templateDir, root);
      stats.forEach(stat => {
        const outputPath = path.join(basePath, stat.name);
        fs.mkdirs(path.join(this.outputDir, outputPath));
        this.emit('create:dir', outputPath);
      });
      next();
    });

    walker.on('file', (root, stat, next) => {
      const basePath = path.relative(this.templateDir, root);
      const outputPath = path.join(basePath, stat.name);
      const data = fs.readFileSync(path.resolve(root, stat.name));
      fs.writeFileSync(
        path.join(this.outputDir, outputPath),
        ejs.render(data.toString('utf8'), this.context)
      );
      this.emit('create:file', outputPath);
      next();
    });

    walker.on('errors', (root, nodeStats, next) => {
      this.emit('error:walk', root, nodeStats);
      next();
    });

    walker.on('end', () => {
      this.emit('done');
    });
  }

  /**
   * Load config from dokata config file
   */
  loadConfig() {
    const defaultConfig = {
      questions: []
    };
    try {
      this.config = Object.assign(
        {},
        defaultConfig,
        fs.readJsonSync(path.join(this.baseDir, CONFIG_FILE_NAME))
      );
    } catch (err) {
      this.config = Object.assign({}, defaultConfig);
    }
  }

  /**
   * Update context
   *
   * @param {Object} context template context for generating files
   */
  updateContext(context) {
    this.context = context;
  }

}
