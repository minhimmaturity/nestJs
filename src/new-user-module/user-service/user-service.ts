import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/UserEntity';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  save(userDto: UserDTO): Promise<UserEntity> {
    return this.userRepository.save(userDto)
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOne(userDto: UserDTO): Promise<UserEntity> {
    return this.userRepository.findOne(userDto);
  }
}
