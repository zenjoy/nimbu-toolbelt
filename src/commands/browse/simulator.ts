import Command from '../base';
import cli from 'cli-ux';

export default class BrowseSimulator extends Command {
  static description = "open the simulator for your current site"

  async run() {
    cli.open('http://localhost:4567/');
  }
}
