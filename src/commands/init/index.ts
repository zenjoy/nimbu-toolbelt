import Command from '../../command'
import * as Nimbu from '../../nimbu/types'
import { color } from '../../nimbu/color'

import cli from 'cli-ux'
import { orderBy } from 'lodash'
import inquirer from 'inquirer'
import logSymbols from 'log-symbols'

export default class Init extends Command {
  static description = 'initialize your working directory to code a selected theme'

  async run() {
    let site = await this.askForSite()
    let haml = await this.askForHaml()
    let cloudCode = await this.askForCloudCode()

    this.log(`You selected ${site.name} / ${haml} / ${cloudCode}`)
  }

  private async askForSite() {
    cli.action.start('Please wait while we get the list of sites...')
    let sites = await this.nimbu.get<Nimbu.Site[]>('/sites', { fetchAll: true })
    cli.action.stop('done \n')

    if (sites.length === 0) {
      this.error("You don't have access to any Nimbu sites.", { exit: 101 })
    }

    if (sites.length > 1) {
      sites = orderBy(sites, [site => site.name.toLowerCase()], ['asc'])
      let choices = sites.map(s => `${s.name} ${color.dim(`(${s.subdomain})`)}`)
      let fuzzy = require('fuzzy')
      let autocompletePrompt = require('inquirer-autocomplete-prompt')

      inquirer.registerPrompt('autocomplete', autocompletePrompt)
      return inquirer
        .prompt({
          type: 'autocomplete',
          name: 'site',
          message: 'On which site would you like to work?',
          source: async (_, input) => {
            input = input || ''
            return fuzzy.filter(input, choices).map(el => el.original)
          },
        })
        .then(answer => {
          let index = choices.indexOf(answer.site)
          return sites[index]
        })
    } else {
      this.log(
        logSymbols.success,
        `You are only linked to ${color.bold(sites[0].name)}, so let's use that for this project.`,
      )

      return sites[0]
    }
  }

  private async askForHaml() {
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'haml',
        message: 'Would you like to work with HAML?',
        default: true,
      })
      .then(answer => {
        return answer.haml
      })
  }

  private async askForCloudCode() {
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'cloudcode',
        message: 'Will you work with cloud code?',
        default: true,
      })
      .then(answer => {
        return answer.cloudcode
      })
  }
}
