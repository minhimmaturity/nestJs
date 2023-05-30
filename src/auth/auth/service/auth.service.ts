import {
  Injectable,
  Res,
  Body,
  HttpStatus,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/auth/model/UserEntity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/auth.dto';
import { UserService } from 'src/auth/auth/service/user-service';
import { CreateUserDTO } from 'src/auth/auth/dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class authService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDTO) {
    const user = await this.userRepository.create(userDto);

    return {
      message: "User registered successfully",
      name: user.name,
    };
  }

  async login (LoginDto: LoginDto) {
    const user = await this.UserService.findLogin(LoginDto);
    const token = this._createToken(user);

    return {
      name: user.name, role: user.role, ...token
    }
  }

  async validateUser(name) {
    const user = await this.UserService.findByName(name);
    if(!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private _createToken({name}): any {
    const access_token = this.jwtService.sign({name});
    return {
      expiresIn: '1h', access_token
    }
  }
}
