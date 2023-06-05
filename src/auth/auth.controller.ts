import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { authService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: authService) {}

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
}
