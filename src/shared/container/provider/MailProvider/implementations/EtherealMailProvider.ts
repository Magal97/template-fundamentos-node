import IMailProvider from '../models/IMailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import ISendMailDTO from '../dtos/ISendMailDTO';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTamplateProvider/models/IMailTamplateProvider';


interface IMessages{
  to: string;
  body: string;
}

@injectable()
export default class FakeMailProvide implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTamplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ){
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;

    });
  };


  public async sendMail({to, from, subject, template }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      text: await this.mailTemplateProvider.parse(template),
    });

    console.log('messege sent: %s', message.messageId);
    console.log('preview url: %s', nodemailer.getTestMessageUrl(message));
  };
};
