import Command from '../command';
import { flags } from '@oclif/command';
import chalk from 'chalk';
import NimbuServer from '../nimbu-gem/server';
import WebpackDevServer from '../webpack/server';

export default class Server extends Command {
  static description = 'run the development server';

  private nimbuServer: NimbuServer = new NimbuServer(this.log, this.warn);
  private webpackServer: WebpackDevServer = new WebpackDevServer();

  static flags = {
    nocookies: flags.boolean({
      description: 'Leave cookies untouched i.s.o. clearing them.'
    }),
    port: flags.integer({
      description: 'The port to listen on.',
      env: 'DEFAULT_PORT',
      default: 4567
    }),
    host: flags.string({
      description: 'The hostname/ip-address to bind on.',
      env: 'HOST',
      default: '0.0.0.0'
    }),
    'nimbu-port': flags.integer({
      description: 'The port for the ruby nimbu server to listen on.',
      env: 'NIMBU_PORT',
      default: 4568
    })
  };


  async spawnNimbuServer(port: number, nocookies: boolean) {
    this.log(chalk.red('Starting nimbu server...'));
    await this.nimbuServer.start(port, { nocookies: nocookies });
  }

  async stopNimbuServer() {
    this.log(chalk.red('Giving nimbu server some time to stop...'));
    await this.nimbuServer.stop();
  }

  async startWebpackDevServer(host: string, defaultPort: number, nimbuPort: number) {
    this.log(chalk.cyan('Starting the development server...\n'));
    await this.webpackServer.start(host, defaultPort, nimbuPort, 'http')
  }

  async stopWebpackDevServer() {
    await this.webpackServer.stop();
  }

  private waitForStopSignals(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      (['SIGINT', 'SIGTERM'] as Array<NodeJS.Signals>).forEach(sig => {
        process.on(sig, async () => {
          this.log(chalk.cyan("Shutting down ..."));
          await this.stopWebpackDevServer();
          await this.stopNimbuServer();
          resolve();
        });
      });
    });
  }

  async run() {
    const { flags } = this.parse(Server);

    await this.spawnNimbuServer(flags["nimbu-port"]!, flags.nocookies);
    await this.startWebpackDevServer(flags.host!, flags.port!, flags["nimbu-port"]!);
    await this.waitForStopSignals();
  }

  async catch() {
    if(this.webpackServer.isRunning()) {
      await this.stopWebpackDevServer();
    }
    if(this.nimbuServer.isRunning()) {
      await this.stopNimbuServer();
    }
  }
}
