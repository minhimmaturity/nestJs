import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
import { authService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from 'src/google-auth/google-auth.service';
import { Cache } from 'cache-manager';
import { Public } from './guards/public.decorater';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: authService,
    private readonly GoogleAuthService: GoogleAuthService,
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  register(@Body() userDto: CreateUserDTO): Promise<any> {
    try {
      return this.authService.register(userDto);
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Get('/login')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.GoogleAuthService.googleLogin(req);
  }

  @Get('refresh-token/:userId')
  async getRefreshToken(
    @Param('userId') userId: string,
  ): Promise<string | null> {
    return this.authService.getRefreshToken(userId);
  }

  @Public()
  @Post('reset-access-token')
  async resetAccessToken(@Req() req, @Body('refreshToken') refreshToken: string) {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace('Bearer ', '');

    const userInfo = await this.authService.decodeExpiredAccessToken(token);

    const newAccessToken = await this.authService.resetAccessToken(userInfo.id, refreshToken);
    return { accessToken: newAccessToken.newAccessToken };
  }

  @Post('/googleTokenAuth')
  async getEmailFromGoogleToken(@Body('token') googleAccessToken: string ) {
    return this.authService.getUserEmailByGoogleAccessToken(googleAccessToken);
  }
}
