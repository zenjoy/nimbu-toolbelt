import Command from '../base';
import run from '../../nimbu-gem/command';

export default class Init extends Command {

  static description = "initialize your working directory to code a selected theme";

  async run() {
    await run('init');
  }
}
