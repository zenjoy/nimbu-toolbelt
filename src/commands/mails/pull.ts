import Command from '../../command'
import * as Nimbu from '../../nimbu/types'
import Config from '../../nimbu/config'

import fs from 'fs-extra'
import ux from 'cli-ux'
import yaml from 'js-yaml'

export default class MailsPull extends Command {
  static description = 'download all notification templates'

  async run() {
    const Listr = require('listr')

    const tasks = new Listr([
      {
        title: 'Fetching notifications',
        task: ctx => this.fetchAll(ctx),
      },
      {
        title: 'Writing all templates to disk',
        task: ctx => this.writeAll(ctx),
      },
    ])

    tasks.run().catch(err => {
      ux.error(err)
    })
  }

  private async fetchAll(ctx: any) {
    ctx.notifications = await this.nimbu.get<Nimbu.Notification[]>('/notifications')
  }

  private async writeAll(ctx: any) {
    const { Observable } = require('rxjs')
    const notifications: Nimbu.Notification[] = ctx.notifications
    const mailsPath = Config.projectPath + '/content/notifications/'

    await fs.mkdirp(mailsPath)

    return new Observable(observer => {
      notifications.forEach(notification => {
        let filename = `${notification.slug}.txt`
        observer.next(filename)

        let fm = yaml.dump({
          name: notification.name,
          description: notification.description,
          subject: notification.subject,
        })

        let content = '---\n' + fm + '---\n\n' + notification.text
        fs.writeFileSync(mailsPath + filename, content)

        if (notification.html_enabled && notification.html) {
          filename = `${notification.slug}.html`
          fs.writeFileSync(mailsPath + filename, notification.html!)
        }

        if (notification.translations !== undefined) {
          Object.keys(notification.translations).forEach(function(locale) {
            let translation = notification.translations![locale]

            if (
              translation.text !== notification.text ||
              translation.html !== notification.html ||
              translation.subject !== notification.subject
            ) {
              let localePath = mailsPath + locale
              fs.mkdirpSync(localePath)

              filename = `${notification.slug}.txt`
              let fm = yaml.dump({
                subject: translation.subject,
              })

              let content = '---\n' + fm + '---\n\n' + translation.text
              fs.writeFileSync(localePath + '/' + filename, content)

              if (notification.html_enabled && translation.html) {
                filename = `${notification.slug}.html`
                fs.writeFileSync(localePath + '/' + filename, translation.html!)
              }
            }
          })
        }
      })

      observer.complete()
    })
  }
}
