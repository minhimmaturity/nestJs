import { Controller, Res, Body, Post, Req , HttpCode, HttpStatus} from '@nestjs/common';
import { authService } from '../service/auth.service';
import { CreateUserDTO } from 'src/auth/auth/dto/user.dto';
import { LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: authService) {}

  @HttpCode(HttpStatus.OK)
  

  @Post('/register')
  register(@Body() userDto: CreateUserDTO): Promise<any> {
    return this.authService.register(userDto);
  }

  @Post('login')
  signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
