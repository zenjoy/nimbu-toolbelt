import Command from '../base';
import { App } from '../../nimbu/types';

export default class AppsList extends Command {

  printApp = (app: App) => {
    this.log(`- ${app.name} (app id: ${app.key})`);
  }

  async run() {
    const apps = await this.client.listApps();
    if(apps.length > 0) {
      this.log('Your current site has the following applications:');
      apps.forEach(this.printApp);
    }
  }
}
