import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dbConfig from 'typeorm.config';
import { UserEntity } from './user/entity/UserEntity';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    UserModule,
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
