import { Module } from '@nestjs/common';
import { AuthController } from './auth/controller/auth.controller';
import { authService } from './auth/service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/auth/model/UserEntity';
import { UserService } from 'src/auth/auth/service/user-service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
// import { AuthGuard } from './auth.guard';
// import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { UserControllerController } from './auth/controller/user-controller.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '58400' },
    }),
  ],
  controllers: [AuthController, UserControllerController],
  providers: [authService, UserService, JwtStrategy
  //    {
  //   provide: APP_GUARD,
  //   useClass: AuthGuard,
  // }
],
  exports: [authService, JwtStrategy]
})
export class AuthModule {}
