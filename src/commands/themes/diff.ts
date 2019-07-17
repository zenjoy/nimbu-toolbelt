import Command from '../../command'
import proxy from '../../nimbu-gem/command'

export default class ThemesDiff extends Command {
  static description = 'describe the command here'

  static flags = {}

  static args = [
    {
      name: 'theme',
      description: 'The name of the theme to list',
    },
  ]

  async run() {
    await this.nimbu.validateLogin()

    if (this.nimbu.token !== undefined) {
      // don't parse, then this.argv is the original arguments (including flags)
      await proxy(this.nimbu.token, 'themes:diff', this.argv)
    }
  }
}
