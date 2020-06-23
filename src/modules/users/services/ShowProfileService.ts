import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject} from 'tsyringe';

interface Request {
  user_id: string;

}

@injectable()
class ShowProfileService {

  constructor (

    @inject('UsersRepository')
    private userRepository: IUserRepository,

    ){};

  public async execute({user_id}: Request): Promise<User> {

    const user = await this.userRepository.findById(user_id);

    if(!user){
      throw new AppError('User not found.');
    }
    return user;

  }
}

export default ShowProfileService;
