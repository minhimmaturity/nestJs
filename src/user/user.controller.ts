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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUser(@Req() req, @Res() res): Promise<void> {
    try {
      const user = req.user;
      const usersWithoutPassword = {
        id: user.id,
        name: user.name,
        roles: user.roles,
      };
      res.status(200).json(usersWithoutPassword);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req, @Res() res: any): Promise<any> {
    const { roles, name, id } = req.user;
    res.json({ roles, name, id });
  }
}
