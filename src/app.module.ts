import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewUserModuleModule } from './new-user-module/new-user-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dbConfig from 'typeorm.config';
import { UserEntity } from './new-user-module/user/UserEntity';
import { UserService } from './new-user-module/user-service/user-service';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TypeOrmModule.forFeature([UserEntity]), NewUserModuleModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
