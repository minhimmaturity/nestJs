import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dbConfig from 'typeorm.config';
import { UserEntity } from './auth/auth/model/UserEntity';
import { UserService } from './auth/auth/service/user-service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
