import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/auth.dto';
// import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/user.dto';
import { User } from './entity/user.entity';
import { Role } from './enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  save(userDto: CreateUserDTO): Promise<User> {
    return this.userRepository.save(userDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email: email });
  }

  async create(userDto: CreateUserDTO): Promise<User> {
    try {
      userDto.password = await bcrypt.hash(userDto.password, 10);

      const userInDb = await this.userRepository.findOne({
        where: { email: userDto.email },
      });

      if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      
      const user = await this.userRepository.create(userDto);
      if(userDto.roles == null) {
        user.roles = Role.User
      } else {
        user.roles = userDto.roles;
      }
      return await this.userRepository.save(user);
      
    } catch (err) {
      throw err;
    }
  }

  async findLogin({ email, password }: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async remove(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return await this.userRepository.remove(user);
  }

  async update(@Body() email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      user.email = email;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      return await this.userRepository.update(user.id, user);
    } else {
      return new HttpException('invalid user', HttpStatus.FORBIDDEN);
    }
  }
}
