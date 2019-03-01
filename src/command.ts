import Command from '@oclif/command'
import Client from './nimbu/client'

export default abstract class extends Command {
  protected _client?: Client

  get nimbu(): Client {
    if (this._client) return this._client
    this._client = new Client(this.config)
    return this._client
  }

  async catch(err: Error) {
    this.error(err.message)
  }
}
