import { IConfig } from '@oclif/config';
import Credentials from './credentials';
import Config from './config';
import { App, AppFile } from './types';
import fetch from 'node-fetch';

export default class Client {
  private config: IConfig;
  private credentials: Credentials;
  private _token?: string;

  constructor(config: IConfig) {
    this.config = config;
    this.credentials = new Credentials(config);
  }

  private async token() {
    if (!this._token) {
      this._token = await this.credentials.token();
    }
    return this._token;
  }

  private async fetch(method: string, path: string, body?: any): Promise<any> {
    const token = await this.token();
    const request = {
      method,
      headers: {
        Authorization: token,
        'X-Nimbu-Client-Version': this.config.version,
        'User-Agent': this.config.userAgent,
        'X-Nimbu-Site': Config.site,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    };
    return fetch(`${Config.host}${path}`, request).then(response => {
      if (response.ok) {
        if (response.status === 204) {
          // No content -> don't try to parse
          return undefined;
        } else {
          return response.json();
        }
      } else {
        throw new Error('An error occured while talking to the nimbu api.');
      }
    });
  }

  private async get(path: string): Promise<any> {
    return this.fetch('GET', path);
  }

  private async post(path: string, body: any): Promise<any> {
    return this.fetch('POST', path, body);
  }

  private async put(path: string, body: any): Promise<any> {
    return this.fetch('PUT', path, body);
  }

  private async list(type: string): Promise<Array<any>> {
    return this.get(`/${type}`);
  }

  async logout(): Promise<void> {
    return this.fetch('POST', '/auth/logout');
  }

  async listApps(): Promise<Array<App>> {
    return this.list('apps');
  }

  async getAppFiles(id: string): Promise<AppFile[]> {
    return this.get(`/apps/${id}/code`);
  }

  async createAppFile(
    app: string,
    name: string,
    code: string
  ): Promise<AppFile> {
    return this.post(`/apps/${app}/code`, {
      name,
      code,
    });
  }

  async updateAppFile(
    app: string,
    name: string,
    code: string
  ): Promise<AppFile> {
    return this.put(`/apps/${app}/code/${name}`, { code });
  }
}
