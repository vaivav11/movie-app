import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(id: number, user: Partial<User>): Promise<User> {
    return this.usersRepository.save({ ...user, id });
  }

  remove(id: number): Promise<void> {
    return this.usersRepository.delete(id).then(() => {});
  }
}


