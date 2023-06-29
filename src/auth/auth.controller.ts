import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { authService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from 'src/google-auth/google-auth.service';

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
  async signIn(@Body() loginDto: LoginDto): Promise<any> {
    const userData = await this.authService.login(loginDto);
    const { access_token, refresh_token, ...user } = userData;
    return {
      message: 'Login successful',
      refresh_token,
      access_token,
      userData: user,
    };
  }

  @Get('/login')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.GoogleAuthService.googleLogin(req);
  }
}
