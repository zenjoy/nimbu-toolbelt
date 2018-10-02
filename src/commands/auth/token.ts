import Command from '../../command';
import run from '../../nimbu-gem/command';

export default class AuthToken extends Command {

  static description = "display your api token";

  async run() {
    await run('auth:token');
  }
}
