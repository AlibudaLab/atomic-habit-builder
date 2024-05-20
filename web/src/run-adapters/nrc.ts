import { IRunAdapter } from './interface';

export class NRCAdapter implements IRunAdapter {
  private accessToken: string;

  public img = require('../imgs/apps/nrc.png');

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async connect() {
    console.log('NRC connect', this.accessToken);
  }

  async getActivities() {
    console.log('NRC get activities', this.accessToken);
  }
}
