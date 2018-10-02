import Command from '../base';
import Config from '../../nimbu/config';
import cli from 'cli-ux';

export default class BrowseAdmin extends Command {

  static description = "open the admin area for your current site";

  async run() {
    cli.open(`https://${Config.site}.${Config.adminHost}/admin`);
  }
}
