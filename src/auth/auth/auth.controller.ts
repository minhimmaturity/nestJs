import { Controller, Res, Body, Post, Req , HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.AuthService.signIn(signInDto.username, signInDto.password);
  }

  @Post('/register')
  register(@Req() req, @Res() res): Promise<void> {
    return this.AuthService.register(req.body, res);
  }
}
