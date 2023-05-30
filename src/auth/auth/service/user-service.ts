import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
// import { CreateUserDTO } from "./../../../../../..//src/new-user-module/user/user.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/UserEntity';
import { CreateUserDTO } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/auth/dto/auth.dto';

export type User = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  save(userDto: CreateUserDTO): Promise<UserEntity> {
    return this.userRepository.save(userDto)
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({  name: username  });
  }

  async findByName(name) {
    return await this.userRepository.findOneBy({name : name});
  }

  async create(userDto: CreateUserDTO): Promise<UserEntity> {
    userDto.password = await bcrypt.hash(userDto.password, 10);

    const userInDb = await this.userRepository.findOne({where:{name : userDto.name}});

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.create(userDto);
  }

  async findLogin({name, password}: LoginDto) {
    const user = await this.userRepository.findOneBy({name : name});

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
