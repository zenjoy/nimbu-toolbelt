const { readSync, write } = require('node-yaml');
import { resolve as resolvePath } from 'path';
import paths = require('../config/paths');
import projectConfig = require('../config/config');

export interface ConfigApp {
  name: string;
  id: string;
  dir: string;
  glob: string;
  host?: string;
}

interface ConfigFile {
  site: string;
  theme: string;
  apps: ConfigApp[];
}

class Config {
  static defaultHost = 'https://api.nimbu.io';

  private _config?: ConfigFile;

  private get config() {
    if (!this._config) {
      const configFile = resolvePath(paths.PROJECT_DIRECTORY, 'nimbu.yml');
      this._config = Object.assign(
        { theme: 'default-theme', apps: [] },
        readSync(configFile)
      );
    }
    return this._config!;
  }

  private async writeConfig() {
    const configFile = resolvePath(paths.PROJECT_DIRECTORY, 'nimbu.yml');
    write(configFile, this._config);
  }

  get isDefaultHost() {
    return this.host === Config.defaultHost;
  }

  get host() {
    return process.env.NIMBU_HOST || projectConfig.NIMBU_HOST || Config.defaultHost;
  }

  get site() {
    return process.env.NIMBU_SITE || projectConfig.NIMBU_SITE || this.config.site;
  }

  get theme() {
    return process.env.NIMBU_THEME || projectConfig.NIMBU_THEME || this.config.theme;
  }

  get hostname() {
    return this.host.replace(/https?:\/\//, '');
  }

  get adminHost() {
    return this.host.replace(/https?:\/\/api\./, '');
  }

  get apps(): ConfigApp[] {
    return this.config.apps.filter(
      a => a.host === this.hostname || (!a.host && this.isDefaultHost)
    );
  }

  async addApp(app: ConfigApp): Promise<void> {
    this.config.apps.push(
      Object.assign({}, app, {
        host: this.hostname,
      })
    );
    this.writeConfig();
  }
}

export default new Config();
