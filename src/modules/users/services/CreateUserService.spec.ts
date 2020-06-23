import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(fakeUserRepository,
      fakeHashProvider, fakeCacheProvider);

  });

  it('should not be able to create a new user with the same email', async () => {

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'joe@outlook.com',
      password: 'user',
    });

    expect(user).toHaveProperty('id');


  });

  it('should be able to create a new user', async () => {

    await createUserService.execute({
      name: 'John Doe',
      email: 'joe@outlook.com',
      password: 'user',
    });

    await expect(createUserService.execute({
      name: 'John Doe',
      email: 'joe@outlook.com',
      password: 'user',
    })).rejects.toBeInstanceOf(AppError);

  });

});
