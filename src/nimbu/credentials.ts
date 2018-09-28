import { IConfig } from '@oclif/config';
import Config from './config';
import { readFile, pathExists } from 'fs-extra';
const urlencode = require('urlencode');

export default class Credentials {

  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  private get homeDirectory() {
    return this.config.home;
  }

  private get credentialsFile() {
    if(Config.isDefaultHost) {
      return `${this.homeDirectory}/.nimbu/credentials`;
    } else {
      return `${this.homeDirectory}/.nimbu/credentials.${urlencode(Config.hostname)}`;
    }
  }

  async token() {
    let token;
    const credentialsExist = await pathExists(this.credentialsFile);
    if(credentialsExist) {
      const credentials = (await readFile(this.credentialsFile)).toString('utf-8');
      const match = credentials.match(/^(bearer|oauth2|token) ([\w]+)$/i);
      if(match) {
        token = match[2];
      }
    }
    if(token) {
      return token;
    } else {
      throw new Error('You are not logged in. Run auth:login command first.');
    }
  }

}
