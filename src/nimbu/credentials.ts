import { IConfig } from '@oclif/config'
import Config from './config'
import { readFileSync, pathExistsSync } from 'fs-extra'
const urlencode = require('urlencode')
import Netrc from 'netrc-parser'

export default class Credentials {
  private readonly config: IConfig
  private _auth?: string

  constructor(config: IConfig) {
    this.config = config
  }

  private get homeDirectory(): string {
    return this.config.home
  }

  private get credentialsFile(): string {
    if (Config.isDefaultHost) {
      return `${this.homeDirectory}/.nimbu/credentials`
    } else {
      return `${this.homeDirectory}/.nimbu/credentials.${urlencode(
        Config.apiHost
      )}`
    }
  }

  get token(): string | undefined {
    if (!this._auth) {
      this._auth = process.env.NIMBU_API_KEY
      if (!this._auth) {
        Netrc.loadSync()
        this._auth =
          Netrc.machines[Config.apiHost] && Netrc.machines[Config.apiHost].token
      }
      if (!this._auth) {
        this._auth = this.migrateFromNimbuToken()
      }
    }
    return this._auth
  }

  private migrateFromNimbuToken(): string | undefined {
    let token
    const credentialsExist = pathExistsSync(this.credentialsFile)
    if (credentialsExist) {
      const credentials = readFileSync(this.credentialsFile).toString('utf-8')
      const match = credentials.match(/^(bearer|oauth2|token) ([\w]+)$/i)
      if (match) {
        token = match[2]
      }
    }
    if (token) {
      Netrc.machines[Config.apiHost] = {}
      Netrc.machines[Config.apiHost].token = token
      return token
    }
  }
}
