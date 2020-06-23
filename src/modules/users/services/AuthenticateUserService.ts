import { sign } from 'jsonwebtoken';
import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { injectable, inject} from 'tsyringe';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor
  (@inject('UsersRepository')
   private userRepository: IUserRepository,

   @inject('HashProvider')
   private hashProvider: IHashProvider
   ){};

  public async execute({ email, password }: Request): Promise<Response> {

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    // password - Senha n criptografada
    // user.password - Senha criptografada
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
