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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/role.decoraters';
import { Role } from './enum/role.enum';

  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    async getUser(@Req() req, @Res() res): Promise<void> {
      const { role } = req.user;
      // if(role == Role.Admin) {
      const User = await this.userService.findAll();
      res.status(201).json(User);
    }
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req, @Res() res: any): Promise<any> {
      const { role, name } = req.user;
      res.json({ role, name });
    }
  }
  