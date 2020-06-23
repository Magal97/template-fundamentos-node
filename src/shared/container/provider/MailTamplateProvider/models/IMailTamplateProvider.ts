import IParseMailTemplateDTO from '../dtos/IParseMailTamplateDTO';

export default interface IMailTamplateProvider{
  parse(data: IParseMailTemplateDTO): Promise<string>;

}
