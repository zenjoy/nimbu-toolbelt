import { Command } from '@oclif/command';
import run from '../../nimbu-gem/command';

export default class AuthLogout extends Command {

  static description = "clear local authentication credentials";

  async run() {
    await run('auth:logout');
  }
}
