import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { authService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from './role.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '58400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [authService, UserService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtStrategy, authService],
})
export class AuthModule {}
