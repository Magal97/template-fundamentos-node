import User from '../../infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProviders.DTO';
import { uuid } from 'uuidv4';

class FakeUserRepository implements IUserRepository{
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined>{
    const user = await this.users.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined>{
    const user = await this.users.find(user => user.email === email);

    return user;

  }

  public async findAllProvider({except_user_id}: IFindAllProvidersDTO): Promise<User[]>{
    let { users } = this;

    if(except_user_id){
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;

  }

  public async create({ name, email, password }: ICreateUserDTO): Promise<User>{

    const user = new User();
    Object.assign(user, { id: uuid(), name, email, password})

    this.users.push(user);

    return user;

  }

  public async save(user: User): Promise<User>{
    const findIndex = this.users.findIndex(userIndex => userIndex.id === user.id);

    this.users[findIndex] = user;

    return user;

  }
}

export default FakeUserRepository;
