import { container } from 'tsyringe';

import IMailTamplateProvider from './models/IMailTamplateProvider';
import HandleBarsMailTamplateProvider from './implementations/HandleBarsMailTamplateProvider';

const provider = {
  handlebars: HandleBarsMailTamplateProvider,
};

container.registerSingleton<IMailTamplateProvider>('MailTamplateProvider', provider.handlebars);

