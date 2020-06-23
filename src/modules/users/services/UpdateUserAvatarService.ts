import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/provider/StorageProvider/models/IStorageProvider';
import { injectable, inject} from 'tsyringe';

interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {

  constructor (

    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider

    ){};

  public async execute({ user_id, avatarFileName }: Request): Promise<User> {

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticate users can change the avatar.', 401);
    }

    if (user.avatar) {
      // Deletar avatar antigo
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
