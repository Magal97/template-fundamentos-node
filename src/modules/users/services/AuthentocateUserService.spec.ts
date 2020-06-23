import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository:FakeUserRepository;
let fakeHashProvider:FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {


    const user = await fakeUserRepository.create({
      name: 'John doe',
      email: 'joe@outlook.com',
      password: 'user',
    });

    const response = await authenticateUser.execute({
      email: 'joe@outlook.com',
      password: 'user',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);

  });

  it('should not be able to authenticate with a non existent user', async () => {


    await expect(
      authenticateUser.execute({
      email: 'joe@outlook.com',
      password: 'user',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to authenticate with a wrong password', async () => {

    await fakeUserRepository.create({
      name: 'John doe',
      email: 'joe@outlook.com',
      password: 'user',
    });

    await expect(
      authenticateUser.execute({
      email: 'joe@outlook.com',
      password: 'wrong',
    })).rejects.toBeInstanceOf(AppError);

  });
});
