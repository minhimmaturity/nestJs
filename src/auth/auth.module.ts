import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { authService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/auth.strategy';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '58400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [authService, UserService, JwtStrategy, JwtAuthGuard, RolesGuard, MailService],
  exports: [JwtStrategy, authService, MailService],
})
export class AuthModule {}
