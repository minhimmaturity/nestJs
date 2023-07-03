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
  Post,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/guards/role.decoraters';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Package } from './enum/type.enum';
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken';

interface DecodeToken extends JwtPayload {
  email: string;
}

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

  @Post('confirmChangePassword')
  async takeConfirmEmail(@Body('email') email: string) {
    await this.userService.getConfirmationEmail(email)
    return {
      message: "sent mail successfully",
    }
  }

  @Put('reset-password')
  async update(@Req() req, @Headers('confirmToken') token: string, @Body('password') password: string) {
    const decodedToken = jwt.verify(token, 'your-secret-key') as DecodeToken;
    try {
      if (await this.userService.resetPassword(decodedToken.email, password)) {
        return {
          message: 'Update user successfully',
        };
      } else {
        throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(
        {
          message: 'Unexpected error occurred',
          error: err.message || 'Internal server error',
        },
        HttpStatus.EXPECTATION_FAILED,
      );
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

  @Get('reset-password/:token')
  async getUpdate(@Param('token') token: string) {
    console.log(token);
  }
}
