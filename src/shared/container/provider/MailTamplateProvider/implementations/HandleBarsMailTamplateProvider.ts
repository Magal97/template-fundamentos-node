import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTamplateDTO';
import IMailTamplateProvider from '../models/IMailTamplateProvider';


export default class HandleBarsMailTemplateProvider implements IMailTamplateProvider{
  public async parse({file, variables }: IParseMailTemplateDTO): Promise<string>{
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })
    const parseTamplate = handlebars.compile(templateFileContent);

    return parseTamplate(variables);

  };

}
