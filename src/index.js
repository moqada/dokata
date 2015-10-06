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
class Generator extends EventEmitter {

  /**
   * constructor
   *
   * @param {string} baseDir base directory path
   */
  constructor(baseDir) {
    super();
    this.baseDir = baseDir;
    this.templateDir = path.join(this.baseDir, TEMPLATE_DIR_NAME);
    this.context = {};

    this.loadConfig();
  }

  /**
   * Generate files from settings of dokata template
   *
   * @param {string} outputDir output directory path
   */
  execute(outputDir) {
    const walker = walk.walk(this.templateDir);

    fs.mkdirs(outputDir);

    walker.on('directories', (root, stats, next) => {
      const basePath = path.relative(this.templateDir, root);
      stats.forEach(stat => {
        const outputPath = path.join(basePath, stat.name);
        fs.mkdirs(path.join(outputDir, outputPath));
        this.emit('create:dir', outputPath);
      });
      next();
    });

    walker.on('file', (root, stat, next) => {
      const basePath = path.relative(this.templateDir, root);
      const outputPath = path.join(basePath, stat.name);
      const data = fs.readFileSync(path.resolve(root, stat.name));
      fs.writeFileSync(
        path.join(outputDir, outputPath),
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
    this.config = Object.assign(
      {},
      defaultConfig,
      fs.readJsonSync(path.join(this.baseDir, CONFIG_FILE_NAME))
    );
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


/**
 * Project Generator
 */
export default class Dokata {

  /**
   * Constructor
   *
   * @param {string|undefined} baseDir dokata template directory path
   */
  constructor(baseDir) {
    debug('baseDir', baseDir);
    if (baseDir !== undefined) {
      this.baseDir = path.resolve(baseDir);
    }
  }

  /**
   * Get list of generator config data
   *
   * @return {Object[]}
   */
  getGeneratorConfigs() {
    if (!this.baseDir) {
      return [];
    }
    return fs.readdirSync(this.baseDir).map(filename => {
      const fp = path.join(this.baseDir, filename);
      if (!fs.statSync(fp).isDirectory()) {
        return null;
      }
      if (!fs.existsSync(path.join(fp, 'dokata.json'))) {
        return null;
      }
      return {
        path: fp,
        name: filename
      };
    }).filter(c => c !== null);
  }

  /**
   * Create Generator
   *
   * @param {string} name generator name
   * @return {Generator|null}
   */
  createGenerator(name) {
    if (this.isPath(name)) {
      return new Generator(path.resolve(name));
    }
    const config = this.getGeneratorConfigs().find(c => {
      return c.name === name;
    });
    if (config) {
      return new Generator(config.path);
    }
    return null;
  }

  /**
   * isPath
   *
   * @param {string} name generator name
   * @return {boolean}
   */
  isPath(name) {
    return /^(?:\.\.?|\~|)\//.test(name);
  }
}


export {Dokata, Generator};
