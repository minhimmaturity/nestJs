import { Controller, Res, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user-service';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserControllerController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/profile')
  async getProfile(@Req() req: any) {
    return req.user
  } 
  @Get()
  async getUser(@Req() req, @Res() res): Promise<void> {
    const User = await this.userService.findAll();
    res.status(201).json(User);
  }

}
