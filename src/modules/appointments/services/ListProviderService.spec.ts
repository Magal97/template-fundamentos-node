import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvider: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;


describe('ListProvider', () => {
 beforeEach(() => {

  fakeUserRepository = new FakeUserRepository();
  fakeCacheProvider = new FakeCacheProvider();
  listProvider = new ListProviderService(fakeUserRepository, fakeCacheProvider);

 });

 it('should be able to list the providers', async() =>{
  const user1 = await fakeUserRepository.create({
    name: 'Jonh Doe',
    email: 'doe@outlook.com',
    password: '1234'
  });

  const user2 = await fakeUserRepository.create({
    name: 'Jonh tre',
    email: 'tre@outlook.com',
    password: '1234'
  });

  const loggedUser = await fakeUserRepository.create({
    name: 'Jonh Doe',
    email: 'doe@outlook.com',
    password: '1234'
  });

  const providers = await listProvider.execute({
    user_id: loggedUser.id,
  });

  expect(providers).toEqual([user1,user2]);

 });

})
