import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/new-user-module/user/UserEntity';
import { UserService } from 'src/new-user-module/user-service/user-service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
// import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { NewUserModuleModule } from 'src/new-user-module/new-user-module.module';

@Module({
  imports: [NewUserModuleModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService,
  //    {
  //   provide: APP_GUARD,
  //   useClass: AuthGuard,
  // }
],
  exports: [AuthService]
})
export class AuthModule {}
