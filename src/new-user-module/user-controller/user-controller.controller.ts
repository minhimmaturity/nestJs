import { Controller, Res, Get, Post, Req } from '@nestjs/common';
import { UserService } from '../user-service/user-service';


@Controller('user-controller')
export class UserControllerController {
  constructor(private readonly userService: UserService) {}

  // @Post('/register')
  // register(@Req() req, @Res() res): Promise<void> {
  //   return this.userService.create(req.body, res);
  // }

  @Get()
  async getUser(@Req() req, @Res() res): Promise<void> {
    const User = await this.userService.findAll();
    res.status(201).json(User);
  }

  // @Post('/login')
  // login(@Req() req, @Res() res): Promise<void> {
  //   return this.userService.login(req.body, res);
  // }
}
