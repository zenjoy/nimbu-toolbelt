import Command from '../../command'

export default class Whoami extends Command {
  static description = 'display the current logged in user'
  static aliases = ['whoami']

  async run() {
    if (process.env.NIMBU_API_KEY) this.warn('NIMBU_API_KEY is set')
    // if (!this.nimbu.auth) this.notloggedin()
    // try {
    //   let { body: account } = await this.nimbu.get('/account', { retryAuth: false })
    //   this.log(account.email)
    // } catch (err) {
    //   if (err.statusCode === 401) this.notloggedin()
    //   throw err
    // }
  }

  notloggedin() {
    this.error('not logged in', { exit: 100 })
  }
}
