import Command from '../command';
import chalk from 'chalk';
import buildConfig = require('../config/config');
import nimbuConfig from '../nimbu/config';

export default class Config extends Command {

  static description = "Show resolved configuration";

  async showBuildConfiguration() {
    this.log(chalk.red("Build configuration"));
    for(const key in buildConfig) {
      this.log(`${key}: ${buildConfig[key]}`);
    }
  }

  async showToolchainConfiguration() {
    this.log(chalk.red("Toolchain configuration"));
    this.log(`site: ${nimbuConfig.site}`);
    this.log(`theme: ${nimbuConfig.theme}`);
    this.log(`host: ${nimbuConfig.host}`);
    this.log(`admin domain: ${nimbuConfig.adminHost}`);
  }

  async run() {
    this.showBuildConfiguration();
    this.showToolchainConfiguration();
  }
}
