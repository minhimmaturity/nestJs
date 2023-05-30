import {
  Injectable,
  Res,
  Body,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/new-user-module/user/UserEntity';
import { Repository } from 'typeorm';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/new-user-module/user-service/user-service';
import { CreateUserDTO } from 'src/new-user-module/user/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findOneBy(LoginDto: LoginDto): Promise<UserEntity> {
    return await this.userRepository.findOneBy({
      name: LoginDto.name,
      password: LoginDto.password,
    });
  }

  async signIn(username, pass): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { name: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(@Body() userDto: CreateUserDTO, @Res() res): Promise<void> {
    const saltOrRounds = 10;
    const { name, password, role } = userDto;

    try {
      if (password.length < 8) {
        res
          .status(400)
          .json({ message: 'Password must contain at least 8 characters' });
        return;
      }

      if (!password.match(/[A-Z]/)) {
        res.status(400).json({
          message: 'Password must contain at least one uppercase letter',
        });
        return;
      }

      if (!password.match(/[!-@]/)) {
        res.status(400).json({
          message: 'Password must contain at least one special character',
        });
        return;
      }

      if (!name || name.trim().length === 0) {
        res.status(400).json({ message: 'Please enter a valid name' });
        return;
      }

      if (typeof role !== 'number' || ![0, 1].includes(role)) {
        res.status(400).json({
          message: 'Please enter a valid role (0 for admin, 1 for user)',
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      const user = new UserEntity();
      user.name = name;
      user.password = hashedPassword;
      user.role = role;

      const savedUser = await this.UserService.create(user);

      if (savedUser) {
        res.status(201).json({ message: 'User created successfully' });
      } else {
        res.status(500).json({ message: 'Failed to save user' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
