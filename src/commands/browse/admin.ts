import Command from '../base';
import Config from '../../nimbu/config';
const openBrowser = require('react-dev-utils/openBrowser');

export default class BrowseAdmin extends Command {

  static description = "open the admin area for your current site";

  async run() {
    openBrowser(`https://${Config.site}.${Config.adminHost}/admin`);
  }
}
