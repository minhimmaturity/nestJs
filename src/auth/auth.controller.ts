import {
  Controller,
  Res,
  Body,
  Post,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { authService } from './auth.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: authService) {}

  @Post('/register')
  register(@Body() userDto: CreateUserDTO): Promise<any> {
    try {
      return this.authService.register(userDto);
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
