import Command from '../../command'
import run from '../../nimbu-gem/command'

export default class AuthLogout extends Command {
  static description = 'clear local authentication credentials'

  async run() {
    await this.nimbu.logout()
    await run('auth:logout')
  }
}
