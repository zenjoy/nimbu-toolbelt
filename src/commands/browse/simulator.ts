import { Command } from '@oclif/command';
const openBrowser = require('react-dev-utils/openBrowser');

export default class BrowseSimulator extends Command {
  static description = "open the simulator for your current site"

  async run() {
    openBrowser('http://localhost:4567/');
  }
}
