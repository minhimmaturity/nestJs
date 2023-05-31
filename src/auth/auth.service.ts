import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/UserEntity';
import { Repository } from 'typeorm';
import { LoginDto } from './auth.dto';
import { CreateUserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
// import { Role } from '../enum/role.enum';

@Injectable()
export class authService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDTO) {
    try {
      const user = await this.userService.create(userDto);

      return {
        message: 'User registered successfully',
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  }

  async login(LoginDto: LoginDto) {
    const user = await this.userService.findLogin(LoginDto);
    const token = this.createToken(user);

    return {
      name: user.name,
      roles: user.roles,
      ...token,
    };
  }

  async validateUser(id) {
    const user = await this.userService.findByName(id);
    if (!user) {
      throw new HttpException('ngu', HttpStatus.OK);
    }
    return user;
  }

  // async findById(id: number): Promise<UserEntity> {
  //   const user = await this.userRepository.findOne(id);
  //   return user;
  // }

  private createToken({ name }): any {
    const access_token = this.jwtService.sign({ name });
    return {
      access_token,
    };
  }
}
