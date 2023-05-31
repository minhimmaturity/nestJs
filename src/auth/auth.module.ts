import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { authService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/UserEntity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { UserService } from 'src/user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '58400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [authService, UserService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtStrategy, authService]
})
export class AuthModule {}
