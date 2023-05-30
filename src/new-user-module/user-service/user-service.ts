import { Injectable, Req, Res } from '@nestjs/common';
// import { CreateUserDTO } from "./../../../../../..//src/new-user-module/user/user.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/UserEntity';
import { CreateUserDTO } from '../user/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export type User = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  save(userDto: CreateUserDTO): Promise<UserEntity> {
    return this.userRepository.save(userDto)
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
  
  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { name: username } });
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find(user => user.username === username);
  // }
  
  
  
}
