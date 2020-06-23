import IMailTamplateProvider from '../models/IMailTamplateProvider';

export default class FakeMailTamplateProvider implements IMailTamplateProvider{
  public async parse(): Promise<string>{
    return 'fake';

  }
}
