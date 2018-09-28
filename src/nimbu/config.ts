const { readSync } = require('node-yaml');
import { resolve as resolvePath }from 'path';
import paths = require('../config/paths');

interface ConfigFile {
  site: string,
  theme: string,
}

class Config {

  static defaultHost = 'https://api.nimbu.io';

  private _config?: ConfigFile;

  private get config() {
    if(!this._config) {
      const configFile = resolvePath(paths.PROJECT_DIRECTORY, 'nimbu.yml');
      this._config = Object.assign({ theme: 'default-theme'}, readSync(configFile));
    }
    return this._config!;
  }

  get isDefaultHost() {
    return this.host === Config.defaultHost;
  }

  get host() {
    return process.env.NIMBU_HOST || Config.defaultHost;
  }

  get site() {
    return process.env.NIMBU_SITE || this.config.site;
  }

  get theme() {
    return process.env.NIMBU_THEME || this.config.theme;
  }

  get hostname() {
    return this.host.replace(/https?:\/\//, '');
  }

  get adminHost() {
    return this.host.replace(/https?:\/\/api\./, '');
  }

}

export default new Config();
