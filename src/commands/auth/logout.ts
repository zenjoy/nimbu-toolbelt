import Command from '../base';
import run from '../../nimbu-gem/command';

export default class AuthLogout extends Command {

  static description = "clear local authentication credentials";

  async run() {
    await this.client.logout();
    await run('auth:logout');
  }
}
