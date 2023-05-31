import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/UserEntity';
import { JwtStrategy } from 'src/auth/auth.strategy';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthController } from 'src/auth/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtService],
  exports: [UserService, JwtService],
})
export class UserModule {}
