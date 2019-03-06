const { readSync, write } = require('node-yaml')
import { resolve as resolvePath } from 'path'
import * as url from 'url'
import paths = require('../config/paths')
import projectConfig = require('../config/config')

export interface ConfigApp {
  name: string
  id: string
  dir: string
  glob: string
  host?: string
}

interface ConfigFile {
  site: string
  theme: string
  apps: ConfigApp[]
}

class Config {
  static defaultHost = 'nimbu.io'

  private _config?: ConfigFile

  // API Configuration
  get isDefaultHost() {
    return this.host === Config.defaultHost || this.host === this.apiUrl
  }

  get host(): string {
    return this.envHost || this.projectHost || Config.defaultHost
  }

  get apiUrl(): string {
    return this.host.startsWith('http') ? this.host : `https://api.${this.host}`
  }
  get apiHost(): string {
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }
    return `api.${this.host}`
  }

  get envHost(): string | undefined {
    return process.env.NIMBU_HOST
  }

  get projectHost(): string | undefined {
    return projectConfig.NIMBU_HOST
  }

  get hostname() {
    return this.host.replace(/https?:\/\//, '')
  }

  // Nimbu Cloud Code Config
  get apps(): ConfigApp[] {
    return this.config.apps.filter(a => a.host === this.apiHost || (!a.host && this.isDefaultHost))
  }

  async addApp(app: ConfigApp): Promise<void> {
    this.config.apps.push(
      Object.assign({}, app, {
        host: this.hostname,
      }),
    )
    await this.writeConfig()
  }

  // Nimbu Site Configuration
  get site() {
    return this.envSite || this.projectSite || this.config.site
  }

  get envSite(): string | undefined {
    return process.env.NIMBU_SITE
  }

  get projectSite(): string | undefined {
    return projectConfig.NIMBU_SITE
  }

  // Nimbu Theme Configuration
  get theme() {
    return this.envTheme || this.projectTheme || this.config.theme
  }

  get envTheme(): string | undefined {
    return process.env.NIMBU_THEME
  }

  get projectTheme(): string | undefined {
    return projectConfig.NIMBU_THEME
  }

  private get config() {
    if (!this._config) {
      const configFile = resolvePath(paths.PROJECT_DIRECTORY, 'nimbu.yml')
      this._config = Object.assign({ theme: 'default-theme', apps: [] }, readSync(configFile))
    }
    return this._config!
  }

  private async writeConfig() {
    const configFile = resolvePath(paths.PROJECT_DIRECTORY, 'nimbu.yml')
    write(configFile, this._config)
  }
}

export default new Config()
