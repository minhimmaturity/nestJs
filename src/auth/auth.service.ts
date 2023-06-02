import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './auth.dto';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
// import { Role } from '../enum/role.enum';

@Injectable()
export class authService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDTO) {
    try {
      const user = await this.userService.create(userDto);

      return {
        message: 'User registered successfully',
        email: user.email,
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
      email: user.email,
      roles: user.roles,
      ...token,
    };
  }

  async validateUser(email) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('ngu', HttpStatus.OK);
    }
    return user;
  }

  private createToken({ email, name, roles }): any {
    const access_token = this.jwtService.sign({ email ,name, roles });
    return {
      access_token,
    };
  }
}
