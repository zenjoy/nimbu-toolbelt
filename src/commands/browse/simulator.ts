import Command from '../../command'
import cli from 'cli-ux'

export default class BrowseSimulator extends Command {
  static description = 'open the simulator for your current site'

  async run() {
    await cli.open('http://localhost:4567/')
  }
}
