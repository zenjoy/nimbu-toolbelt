import { ChildProcess } from 'child_process'
import spawn from './process'

export interface NimbuGemServerOptions {
  nocookies?: boolean
}

export default class NimbuGemServer {
  private process?: ChildProcess
  private logger?: (message: string) => void
  private errorLogger?: (message: string) => void

  constructor(
    logger?: (message: string) => void,
    errorLogger?: (message: string) => void
  ) {
    this.logger = logger
    this.errorLogger = errorLogger
  }

  private handleStdout = (data: any): void => {
    if (this.logger) {
      this.logger(data.toString())
    }
  }

  private handleStderr = (data: any): void => {
    if (this.errorLogger) {
      this.errorLogger(data.toString())
    }
  }

  async start(port: number, options?: NimbuGemServerOptions): Promise<void> {
    const args = ['--haml', '--host', '127.0.0.1', '--port', `${port}`]
    if (options && options.nocookies) {
      args.push('--nocookies')
    }
    this.process = spawn('server', args, ['inherit', 'pipe', 'pipe'])
    this.process.stdout.on('data', this.handleStdout)
    this.process.stderr.on('data', this.handleStderr)
    return new Promise<void>((resolve, reject) => {
      const startListener = (data: any) => {
        if (/Listening on .*, CTRL\+C to stop/.test(data.toString())) {
          this.process!.stdout.removeListener('data', startListener)
          resolve()
        } else if (/ERROR/.test(data.toString())) {
          this.process!.stdout.removeListener('data', startListener)
          reject(new Error('Could not start nimbu server'))
        }
      }
      this.process!.stdout.on('data', startListener)
    })
  }

  async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.process) {
        this.process.once('close', () => {
          this.process = undefined
          resolve()
        })
        this.process.kill('SIGTERM')
      } else {
        reject(new Error('Server is not started'))
      }
    })
  }

  isRunning(): boolean {
    return this.process !== undefined
  }
}
