import Command from '../../command';
import { flags } from '@oclif/command';
import Config, { ConfigApp } from '../../nimbu/config';
import { AppFile } from '../../nimbu/types';
import * as glob from 'glob';
import { promisify } from 'util';
import cli from 'cli-ux';
import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { readFile } from 'fs-extra';

async function findMatchingFiles(dir: string, pattern: string) : Promise<string[]> {
  return await promisify(glob)(`${dir}/${pattern}`);
}

export default class AppsPush extends Command {
  static description = 'Push your cloud code files to nimbu';

  static flags = {
    app: flags.string({
      char: 'a',
      description: 'The (local) name of the application to push to (see apps:list and apps:config).',
    }),
  };

  static strict = false;

  static args = [{
    'name': 'files',
    'description': "The files to push."
  }];

  private _app?: ConfigApp;
  private _files?: string[];
  private _code?: AppFile[];

  get app() : ConfigApp {
    if(!this._app) {
      const { flags } = this.parse(AppsPush);
      if(flags.app) {
        const app = Config.apps.find((a) => a.name === flags.app);
        if(app) {
          this._app = app;
        } else {
          throw new Error("Requested application not found.");
        }
      } else if(Config.apps.length == 1) { // If there is only 1 app, we allow flags.app to be empty
        this._app = Config.apps[0];
      } else if(Config.apps.length == 0) {
        throw new Error("No applications configured, please execute apps:config first.");
      } else {
        throw new Error("More than 1 application is configured, but you didn't pass the --app flag.");
      }
    }
    return this._app!;
  }

  async files() : Promise<string[]> {
    if(!this._files) {
      const { argv } = this.parse(AppsPush);
      if(argv.length > 0) {
        this._files = argv.slice();
      } else {
        this._files = await findMatchingFiles(this.app.dir, this.app.glob);
      }
    }
    return this._files!
  }

  async code() : Promise<AppFile[]> {
    if(!this._code) {
      this._code = await this.client.getAppFiles(this.app.id);
    }
    return this._code;
  }

  private async executePush(filename: string, executor: (app: string, name: string, code: string) => Promise<AppFile>) {
    const name = filename.replace(`${this.app.dir}/`, '');
    const resolved = resolvePath(filename);
    const code = await readFile(resolved);
    await executor(this.app.id, name, code.toString('utf-8'));
    cli.action.stop(chalk.green('✓'));
  }

  private async pushNewFile(filename: string) {
    await this.executePush(filename, (...args) => this.client.createAppFile(...args));
  }

  private async pushExistingFile(filename: string, existing: AppFile) {
    await this.executePush(filename, (...args) => this.client.updateAppFile(...args));
  }

  private async pushFile(filename: string) {
    const code = await this.code();
    const existing = code.find((f) => `${this.app.dir}/${f.name}` === filename);
    cli.action.start(`  - ${filename}${existing ? '' : ' (new)'}`);
    if(existing) {
      return this.pushExistingFile(filename, existing);
    } else {
      return this.pushNewFile(filename);
    }

  }

  async run() {
    const files = await this.files();
    this.log(`Pushing code for app ${this.app.name}:`);
    for(const file of files) {
      await this.pushFile(file);
    }
  }
}
