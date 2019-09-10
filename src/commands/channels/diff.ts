import Command from '../../command'
import Config from '../../nimbu/config'

import { flags } from '@oclif/command'
import ux from 'cli-ux'
import chalk from 'chalk'
import { detailedDiff } from 'deep-object-diff'
import { pretty } from 'js-object-pretty-print'

export default class DiffChannels extends Command {
  static description = 'check differences between channel settings from one to another'

  static flags = {
    from: flags.string({
      char: 'f', // shorter flag version
      description: 'slug of the source channel',
      required: true,
    }),
    to: flags.string({
      char: 't', // shorter flag version
      description: 'slug of the target channel',
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(DiffChannels)

    let fromChannel: string
    //let toChannel: string
    let fromSite: string | undefined
    let toSite: string | undefined

    let fromParts = flags.from.split('/')
    if (fromParts.length > 1) {
      fromSite = fromParts[0]
      fromChannel = fromParts[1]
    } else {
      fromSite = Config.site
      fromChannel = fromParts[0]
    }
    let toParts = flags.to.split('/')
    if (toParts.length > 1) {
      toSite = toParts[0]
      //toChannel = toParts[1]
    } else {
      toSite = Config.site
      //toChannel = toParts[0]
    }

    if (fromSite === undefined) {
      ux.error('You need to specify the source site.')
      return
    }

    if (toSite === undefined) {
      ux.error('You need to specify the destination site.')
      return
    }

    let query = ''
    let description = ''

    if (fromChannel !== '*' && fromChannel.indexOf('*') === -1) {
      query = `?slug=${fromChannel}`
      description = `channel ${chalk.bold(fromChannel)}`
    } else if (fromChannel !== '*' && fromChannel.indexOf('*') !== -1) {
      query = `?slug.start=${fromChannel}`
      description = `channel where slug starts with ${chalk.bold(fromChannel.replace('*', '..'))}`
    } else {
      description = `${chalk.bold('all channels')}`
    }

    ux.action.start(`Fetching ${description} from site ${chalk.bold(fromSite)}`)

    let options = {
      fetchAll: true,
      site: fromSite,
    }

    let channelSummaries: any = await this.nimbu.get(`/channels${query}`, options)
    ux.action.stop()

    for (let channel of channelSummaries) {
      ux.action.start(`Comparing channel ${chalk.bold(channel.slug)}`)

      let detailedFrom: any
      let detailedTo: any

      try {
        detailedFrom = await this.nimbu.get(`/channels/${channel.slug}`, { site: fromSite })
      } catch (error) {
        if (error.body === undefined || error.body.code !== 101) {
          throw new Error(error.message)
        }
      }

      try {
        detailedTo = await this.nimbu.get(`/channels/${channel.slug}`, { site: toSite })
      } catch (error) {
        if (error.body === undefined || error.body.code !== 101) {
          throw new Error(error.message)
        }
      }

      ux.action.stop()

      if (detailedTo == undefined) {
        ux.info(`Channel  ${chalk.bold(channel.slug)} is missing in site ${chalk.bold(toSite)}`)
      } else {
        this.cleanUpBeforeDiff(detailedFrom)
        this.cleanUpBeforeDiff(detailedTo)

        let diff = detailedDiff(detailedFrom, detailedTo)
        ux.log(pretty(diff))
      }
    }
  }

  private cleanUpBeforeDiff(data) {
    this.cleanUpIds(data)

    for (let field of data.customizations) {
      this.cleanUpIds(field)

      if (field.select_options != null) {
        for (let option of field.select_options) {
          this.cleanUpIds(option)
        }
      }
    }
  }

  private cleanUpIds(data) {
    delete data.id
    delete data.created_at
    delete data.updated_at
  }
}
