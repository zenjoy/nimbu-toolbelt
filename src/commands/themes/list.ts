import Command from '../../command';
import run from '../../nimbu-gem/command';

export default class ThemesList extends Command {
  static description = 'list all layouts, templates and assets'

  static args = [
    {
      name: 'theme',
      description: 'The name of the theme to list'
    }
  ]

  async run() {
    // don't parse, then this.argv is the original arguments (including flags)
    await run('themes:list', this.argv)
  }
}
