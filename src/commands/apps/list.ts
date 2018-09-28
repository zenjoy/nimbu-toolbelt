import Command from '../base';

export default class AppsList extends Command {

  printApp = (app: {name: string, key: string}) => {
    this.log(`- ${app.name} (app id: ${app.key})`);
  }

  async run() {
    const apps = await this.client.list('apps');
    if(apps.length > 0) {
      this.log('Your current site has the following applications:');
      apps.forEach(this.printApp);
    }
  }
}
