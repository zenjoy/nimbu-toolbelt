import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import NimbuServer from '../nimbu-gem/server';
import WebpackDevServer from '../webpack/server';

export default class Server extends Command {
  static description = 'run the development server';

  private useYarn = true;

  private NIMBU_PORT = parseInt(process.env.NIMBU_PORT || '4568', 10);
  private DEFAULT_PORT = parseInt(process.env.PORT || '4567', 10);
  private HOST = process.env.HOST || '0.0.0.0';

  private nimbuServer: NimbuServer = new NimbuServer(this.log, this.warn);
  private webpackServer: WebpackDevServer = new WebpackDevServer();

  static flags = {
    nocookies: flags.boolean(),
  };


  async spawnNimbuServer(nocookies: boolean) {
    this.log(chalk.red('Starting nimbu server...'));
    await this.nimbuServer.start(this.NIMBU_PORT, { nocookies: nocookies });
  }

  async stopNimbuServer() {
    this.log(chalk.red('Giving nimbu server some time to stop...'));
    await this.nimbuServer.stop();
  }

  async startWebpackDevServer() {
    this.log(chalk.cyan('Starting the development server...\n'));
    await this.webpackServer.start(this.HOST, this.DEFAULT_PORT, this.NIMBU_PORT, 'http')
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

    await this.spawnNimbuServer(flags.nocookies);
    await this.startWebpackDevServer();
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
