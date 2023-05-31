import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/auth.dto';
import { UserEntity } from './entity/UserEntity';
import { CreateUserDTO } from './user.dto';

export type User = any;

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  save(userDto: CreateUserDTO): Promise<UserEntity> {
    return this.userRepository.save(userDto);
  }

  async findById(sub: number) {
    const user = await this.userRepository.findBy({id: sub});
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ name: username });
  }

  async findByName(name) {
    return await this.userRepository.findOneBy({ name: name });
  }

  async create(userDto: CreateUserDTO): Promise<UserEntity> {
    try {
      userDto.password = await bcrypt.hash(userDto.password, 10);

      const userInDb = await this.userRepository.findOne({
        where: { name: userDto.name },
      });

      if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userRepository.create(userDto);
      return await this.userRepository.save(user);
    } catch (err) {
      throw err;
    }
  }

  async findLogin({ name, password }: LoginDto) {
    const user = await this.userRepository.findOneBy({ name: name });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findByIdAndName( name: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: {  name } });
    return user;
  }
}
