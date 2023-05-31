import {
  Controller,
  Res,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
  HttpStatus,
  HttpException,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/role.decoraters';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUser(@Res() res): Promise<void> {
    const user = await this.userService.findAll();
    const usersWithoutPassword = user.map(({ id, name, roles }) => ({
      id,
      name,
      roles,
    }));

    res.status(201).json(usersWithoutPassword);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req, @Res() res: any): Promise<any> {
    const { roles, name, id } = req.user;
    res.json({ roles, name, id });
  }
}
