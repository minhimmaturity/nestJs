import {
  Controller,
  Res,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Put
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/role.decoraters';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  async getUser(@Req() req, @Res() res): Promise<void> {
    try {
      const user = await this.userService.findAll();
      const usersWithoutPassword = user.map(({ id, name, roles }) => ({
        id,
        name,
        roles,
      }));

      res.status(201).json(usersWithoutPassword);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Body('name') name: string) {
    try {
      if(await this.userService.remove(name)) {
        return {
          'message': "Remove user successfully",
        }
      } else {
        throw new HttpException('Remove failed', HttpStatus.BAD_REQUEST);
      }
    } catch(err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
    
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req, @Res() res: any): Promise<any> {
    const { roles, name, id } = req.user;
    res.json({ roles, name, id });
  }

  @Put('/update')
  async update(@Body('name') name: string, @Body('password') password: string) {
    try {
      if(await this.userService.update(name, password)) {
        return {
          'message': "Update user successfully",
        }
      } else {
        throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
      }
    } catch(err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
  }

}
