import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

  });

  it('should be able to update the profile', async () => {
    const user = fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    const updatedUser = await updateProfile.execute({
      user_id: (await user).id,
      name: 'Joh tre',
      email: 'tre@outlook.com',
    });


    expect(updatedUser.name).toBe('Joh tre');
    expect(updatedUser.email).toBe('tre@outlook.com');

  });

  it('should not be able to change to another user email', async () => {
    fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'mimi@outlook.com',
      password: '12345',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'teste',
      email: 'queromi@outlook.com',
    })).rejects.toBeInstanceOf(AppError);


  });

  it('should be able to update the password', async () => {
    const user = fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    const updatedUser = await updateProfile.execute({
      user_id: (await user).id,
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      old_password: '12345',
      password: '2323',
    });


    expect(updatedUser.password).toBe('2323');

  });

  it('should not be able to update the password without the old password', async () => {
    const user = fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    await expect(updateProfile.execute({
      user_id: (await user).id,
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '2323',
    })).rejects.toBeInstanceOf(AppError);


  });

  it('should not be able to update the profile from a non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing',
      name: 'non existing',
      email: 'test',
    })).rejects.toBeInstanceOf(AppError);

  });


  it('should not be able to update the password with wrong old password', async () => {
    const user = fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '12345',
    })

    await expect(updateProfile.execute({
      user_id: (await user).id,
      name: 'Jonh Doe',
      email: 'queromi@outlook.com',
      password: '2323',
      old_password: 'wrong-old-password'
    })).rejects.toBeInstanceOf(AppError);


  });

});
