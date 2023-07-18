import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { google, Auth } from 'googleapis'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class authService {
  oauthClient: Auth.OAuth2Client
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly UserService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async register(userDto: CreateUserDTO) {
    try {
      const user = await this.UserService.create(userDto);
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
    const user = await this.userRepository.findOne({
      where: { email: LoginDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compare(LoginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.createToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return {
      email: user.email,
      name: user.name,
      roles: user.roles,
      ...token,
      ...refreshToken,
    };
  }

  private createToken({ id, email, name, roles }): any {
    const access_token = this.jwtService.sign(
      { id, email, name, roles },
      { expiresIn: '1d' },
    );
    return {
      access_token,
    };
  }

  private generateRefreshToken({ id, email, name, roles }): any {
    const expiresIn = 60 * 60 * 24 * 7;
    const refreshToken = this.jwtService.sign({ id, email, name, roles }, {expiresIn: expiresIn});
    
    const cacheKey = `refresh_token_${id}`;
    this.cacheManager.set(cacheKey, refreshToken, expiresIn);

    return {
      refresh_token: refreshToken,
      refresh_token_expires_in: expiresIn,
    };
  }

  async getRefreshToken(userId: string): Promise<any> {
    const cacheKey = `refresh_token_${userId}`;
    const refreshToken = await this.cacheManager.get(cacheKey);

    if (refreshToken) {
      return {
        refreshToken: refreshToken,
      };
    } else {
      return {
        message: 'No refresh token',
      };
    }
  }

  async resetAccessToken(userId: string, refreshToken: string) {
    const cacheKey = `refresh_token_${userId}`;
    const refreshTokenInCache = await this.cacheManager.get(cacheKey);
    const refreshTokenString = refreshTokenInCache as string;
  
    const userInfoInCache = this.jwtService.verify(refreshTokenString);
    const { id: uId } = userInfoInCache; // Retrieve the 'id' property from userInfoInCache
    const user = await this.userRepository.findOne({ where: { id: uId } });
    if (userId !== uId && refreshTokenInCache !== refreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  
    const newAccessToken = this.createToken(user);
  
    return {
      name: user.name,
      email: user.email,
      roles: user.roles,
      newAccessToken,
    };
  }
  

  async decodeExpiredAccessToken(access_token: string): Promise<any> {
    const userInfo = this.jwtService.decode(access_token);
    return userInfo;
  }

  async getUserEmailByGoogleAccessToken(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    
    const userInfo = await this.UserService.findOne(tokenInfo.email)
    if(userInfo == null) {
      return await this.register(userInfo)
    }

    return await this.login(userInfo)
  }
  
}
