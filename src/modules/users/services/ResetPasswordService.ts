import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { injectable, inject} from 'tsyringe';
import { addHours, isAfter } from 'date-fns';


interface Request {
  token: string;
  password: string;

}

@injectable()
class ResetPasswordService {
  constructor (

  @inject('UsersRepository')
  private usersRepository: IUserRepository,

  @inject('UserTokensRepository')
  private userTokenRepository: IUserTokensRepository,

  @inject('HashProvider')
  private hashProvider: IHashProvider,

  ){};

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if(!userToken){
      throw new AppError('Token does not exist');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user){
      throw new AppError('User does not exist');
    }

    const tokenCreadetAt = userToken.created_at;
    const compareDate = addHours(tokenCreadetAt, 2);

    if(isAfter(Date.now(), compareDate)){
      throw new AppError('token expired.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);

  }



}

export default ResetPasswordService;
