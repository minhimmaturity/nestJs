import { Injectable, HttpException, HttpStatus, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';



@Injectable()
export class authService {

  constructor(
    @InjectRepository(User)
    // private readonly Cache: Cache,
    @Inject(CACHE_MANAGER) 
    private readonly cacheManager: Cache,
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

  async login(loginDto: LoginDto) {
    const user = await this.userService.findLogin(loginDto);
    
    const tokens = this.createTokens(user);
    const refreshToken = this.createRefreshToken(user)

    return {
      email: user.email,
      name: user.name,
      roles: user.roles,
      ...tokens,
      ...refreshToken
    };
  }

  async validateUser(email) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private createTokens({ email, name, roles }): any {
    const access_token = this.jwtService.sign({ email, name, roles });
    return {
      access_token,
    };
  }

  private createRefreshToken({ email, name, roles }): any {
    const refresh_token = jwt.sign({ email, name, roles }, 'refresh_secret_key', { expiresIn: '7d' });
    return {
      refresh_token
    }
  }

  async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.cacheManager.set(`refreshToken:${email}`, refreshToken);
  }

  async getRefreshToken(email: string): Promise<string | undefined> {
    return this.cacheManager.get(`refreshToken:${email}`);
  }

  async deleteRefreshToken(email: string): Promise<void> {
    await this.cacheManager.del(`refreshToken:${email}`);
  }
}
