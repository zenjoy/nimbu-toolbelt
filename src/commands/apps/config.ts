import Command from '../../command'
import { App } from '../../nimbu/types'
import cli from 'cli-ux'
import Config from '../../nimbu/config'
import { pathExists } from 'fs-extra'

export default class AppsList extends Command {
  static description = 'Add an app to the local configuration'

  removeConfigured(apps: App[]): App[] {
    const configuredIds = Config.apps.map(a => a.id)
    return apps.filter(a => !configuredIds.includes(a.key))
  }

  async pickApp(apps: App[]): Promise<App> {
    apps.forEach((a, i) => {
      this.log(`[${i + 1}] ${a.name}`)
    })
    const answer = await cli.prompt('Which application do you want to configure?', {
      required: true,
      default: '1',
    })
    const picked = parseInt(answer)
    if (!(picked !== NaN && picked > 0 && picked <= apps.length)) {
      this.error('Invalid application chosen')
    }
    return apps[picked - 1]
  }

  async configureApp(app: App): Promise<void> {
    const name = await cli.prompt(
      'Give this app a local name. Make it short and (white)spaceless! You might have to type it in apps:push commands.',
      {
        required: true,
        default: app.name.toLowerCase().replace(' ', '_'),
      },
    )
    const dir = await cli.prompt('Where is the code?', {
      required: true,
      default: 'code',
    })
    const glob = await cli.prompt('What files should be pushed?', {
      required: true,
      default: '*.js',
    })
    const dirExists = await pathExists(dir)
    if (dirExists || (await cli.confirm(`Code directory doesn't exists, are you sure want to continue?`))) {
      await Config.addApp({
        name,
        id: app.key,
        dir,
        glob,
      })
    }
  }

  async run() {
    const apps = await this.nimbu.listApps()
    if (apps.length > 0) {
      const app = await this.pickApp(this.removeConfigured(apps))
      await this.configureApp(app)
    } else {
      this.error(`Your site doesn't have apps yet.`)
    }
  }
}
