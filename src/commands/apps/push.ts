import Command from '../base';
import { flags } from '@oclif/command';

export default class AppsPush extends Command {
  static description = 'Push your cloud code files to nimbu';

  static flags = {
    app: flags.string({
      char: 'a',
      description: 'The name of the application to push to (see apps:list and apps:config).',
    }),
  };

  static strict = false;

  static args = [{
    'name': 'files',
    'description': "The files to push."
  }];

  async run() {
    const { argv, flags } = this.parse(AppsPush);

    this.log(argv.join(" "));
    this.log(JSON.stringify(flags));
  }
}
