import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/provider/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

  });

  it('should not be able to create a avatar', async () => {
    const user = fakeUserRepository.create({
      name: 'queroDormir',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'img.jpg',
    });

    await expect((await user).avatar).toBe('img.jpg');


  });

  it('should not be able to update avatar from non existent user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'no-existent',
      avatarFileName: 'img.jpg',
    })).rejects.toBeInstanceOf(AppError);


  });

  it('should be able to delete old avatar when updating a new one', async () => {

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = fakeUserRepository.create({
      name: 'queroDormir',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'img.jpg',
    });

    await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'img.jpg2',
    });

    await expect(deleteFile).toBeCalledWith('img.jpg');
    await expect((await user).avatar).toBe('img.jpg2');


  });


});
