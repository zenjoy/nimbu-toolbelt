import { IConfig } from '@oclif/config'
import Credentials from './credentials'
import Vars from './config'
import { App, AppFile } from './types'
import Nimbu from 'nimbu-client'

export namespace Client {
  export interface Options {
    retryAuth?: boolean
    fetchAll?: boolean
    headers?: object
    body?: object
    auth?: string
  }
}

export default class Client {
  private readonly credentials: Credentials
  private readonly client: typeof Nimbu

  constructor(protected config: IConfig) {
    this.config = config
    this.credentials = new Credentials(config)
    this.client = new Nimbu({
      token: this.credentials.token,
      host: Vars.apiUrl,
      userAgent: this.config.userAgent,
    })
  }

  get auth(): string | undefined {
    return this.client.token
  }

  async logout(): Promise<void> {
    return this.post('/auth/logout')
  }

  async listApps(): Promise<Array<App>> {
    return this.get('/apps')
  }

  async getAppFiles(id: string): Promise<AppFile[]> {
    return this.get(`/apps/${id}/code`)
  }

  async createAppFile(app: string, name: string, code: string): Promise<AppFile> {
    return this.post(`/apps/${app}/code`, {
      body: {
        name,
        code,
      },
    })
  }

  async updateAppFile(app: string, name: string, code: string): Promise<AppFile> {
    return this.put(`/apps/${app}/code/${name}`, {
      body: {
        code,
      },
    })
  }

  get<T>(url: string, options: Client.Options = {}) {
    return this.client.get<T>(url, options)
  }

  post<T>(url: string, options: Client.Options = {}) {
    return this.client.post<T>(url, options)
  }

  put<T>(url: string, options: Client.Options = {}) {
    return this.client.put<T>(url, options)
  }

  patch<T>(url: string, options: Client.Options = {}) {
    return this.client.patch<T>(url, options)
  }

  delete<T>(url: string, options: Client.Options = {}) {
    return this.client.delete<T>(url, options)
  }

  request<T>(url: string, options: Client.Options = {}) {
    return this.client.request<T>(url, options)
  }
}
