import { CacheModule, Module } from '@nestjs/common';
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
import { GoogleAuthModule } from 'src/google-auth/google-auth.module';
import { GoogleAuthService } from 'src/google-auth/google-auth.service';
import { redisStore } from 'cache-manager-redis-store';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    GoogleAuthModule,
    MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        username: 'default',
        password: 'TI3Bd2LVqJRxdhOfjPtF8V2M8L4BZBVq',
        socket: {
          host: 'redis-19252.c56.east-us.azure.cloud.redislabs.com',
          port: 19252
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [authService, UserService, JwtStrategy, JwtAuthGuard, RolesGuard, MailService, GoogleAuthService],
  exports: [JwtStrategy, authService, MailService],
})
export class AuthModule {}
