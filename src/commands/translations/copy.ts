import Command from '../../command'
import Config from '../../nimbu/config'

import { flags } from '@oclif/command'
import ux from 'cli-ux'
import chalk from 'chalk'
import { Observable } from 'rxjs'

export default class CopyTranslations extends Command {
  static description = 'copy translations from one site to another'

  static args = [
    {
      name: 'query',
      required: false,
      description: 'query to match subset of translations to be copied',
      default: '*',
    },
  ]

  static flags = {
    from: flags.string({
      char: 'f', // shorter flag version
      description: 'subdomain of the source site',
      default: Config.site,
    }),
    to: flags.string({
      char: 't', // shorter flag version
      description: 'subdomain of the destination site',
      default: Config.site,
    }),
    toHost: flags.string({
      description: 'hostname of target Nimbu API',
      default: Config.apiUrl,
    }),
    fromHost: flags.string({
      description: 'hostname of origin Nimbu API',
      default: Config.apiUrl,
    }),
  }

  async run() {
    const Listr = require('listr')
    const { flags, args } = this.parse(CopyTranslations)

    let fromSite = flags.from!
    let toSite = flags.to!
    let fromHost = flags.fromHost!
    let toHost = flags.toHost!

    if (fromSite === toSite) {
      ux.error('The source site needs to differ from the destination.')
      return
    }

    let fetchTitle = `Querying translations from site ${chalk.bold(fromSite)}`
    let createTitle = `Copying translations to site ${chalk.bold(toSite)}`

    const tasks = new Listr([
      {
        title: fetchTitle,
        task: ctx => this.fetchTranslations(ctx),
      },
      {
        title: createTitle,
        task: ctx => this.createTranslations(ctx),
        skip: ctx => ctx.translations.length === 0,
      },
    ])

    tasks
      .run({
        fromSite,
        toSite,
        fromHost,
        toHost,
        files: {},
        query: args.query,
      })
      .catch(() => {})
  }

  private async fetchTranslations(ctx: any) {
    let options: any = { fetchAll: true }
    if (ctx.fromSite != null) {
      options.site = ctx.fromSite
      options.host = ctx.fromHost
    }
    try {
      let query = ''
      if (ctx.query === '*') {
        // fetch all translations
      } else if (ctx.query.indexOf('*') !== -1) {
        query = `?key.start=${ctx.query.replace('*', '')}`
      } else {
        query = `?key=${ctx.query}`
      }
      ctx.translations = await this.nimbu.get(`/translations${query}`, options)
    } catch (error) {
      if (error.body != null && error.body.code === 101) {
        throw new Error(`could not find any translations matching ${chalk.bold(ctx.query)}`)
      } else {
        throw new Error(error.message)
      }
    }
  }

  private async createTranslations(ctx: any) {
    const perform = async observer => {
      let crntIndex = 1

      const nbtranslations = ctx.translations.length
      for (let translation of ctx.translations) {
        try {
          observer.next(`[${crntIndex}/${nbtranslations}] Copying translation ${translation.key} to site ${ctx.toSite}`)
          await this.nimbu.post(`/translations`, {
            body: translation,
            site: ctx.toSite,
            host: ctx.toHost,
          })
        } catch (error) {
          throw new Error(`Error for translations ${chalk.bold(translation.key)}: ${error.message}`)
        }

        crntIndex++
      }
    }

    return new Observable(observer => {
      perform(observer)
        .then(() => observer.complete())
        .catch(error => observer.error(error))
    })
  }
}
