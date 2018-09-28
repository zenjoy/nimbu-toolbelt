import Command from '../base';
import run from '../../nimbu-gem/command';

export default class AuthLogin extends Command {

  static description = "log in with your nimbu credentials";

  async run() {
    await run('auth:login');
  }
}
