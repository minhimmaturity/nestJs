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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/guards/role.decoraters';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Package } from './enum/type.enum';
import { LinksService } from 'src/links/links.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
      if (await this.userService.remove(name)) {
        return {
          message: 'Remove user successfully',
        };
      } else {
        throw new HttpException('Remove failed', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req, @Res() res: any): Promise<any> {
    const { roles, name, id } = req.user;
    res.json({ roles, name, id });
  }

  @Put('/reset-password')
  async update(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      if (await this.userService.resetPassword(email, password)) {
        return {
          message: 'Update user successfully',
        };
      } else {
        throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Put('/update-package')
  @UseGuards(JwtAuthGuard)
  async updatePackage(@Req() req, @Body('package') userPackage: Package) {
    const { email } = req.user;
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (await this.userService.updatePackage(user.email, userPackage)) {
      return {
        message: 'Update package successfully',
      };
    } else {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    }
  }
}
