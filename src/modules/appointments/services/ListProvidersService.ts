import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import RedisCacheProvider from '@shared/container/provider/CacheProvider/models/ICacheProvider';
import { injectable, inject} from 'tsyringe';

interface Request {
  user_id: string;

}

@injectable()
class ListProviderService {

  constructor (

    @inject('UsersRepository')
    private userRepository: IUserRepository,


    @inject('CacheProvider')
    private cacheProvider: RedisCacheProvider,

    ){};

  public async execute({user_id}: Request): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    if(!users){
      users = await this.userRepository.findAllProvider({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, users);

    }

    return users;

  }
}

export default ListProviderService;
