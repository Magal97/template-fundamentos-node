import path from 'path';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IMailProvider from '@shared/container/provider/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import { injectable, inject} from 'tsyringe';


interface Request {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor (

  @inject('UsersRepository')
  private usersRepository: IUserRepository,

  @inject('MailProvider')
  private mailProvider: IMailProvider,

  @inject('UserTokensRepository')
  private userTokenRepository: IUserTokensRepository,
  ){};

  public async execute({ email }: Request): Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError('User does not exist.');
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      template: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });

  }

}

export default SendForgotPasswordEmailService;
