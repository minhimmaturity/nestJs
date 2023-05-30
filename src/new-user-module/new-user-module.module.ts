import { Module } from '@nestjs/common';
import { UserControllerController } from './user-controller/user-controller.controller';
import { UserService } from './user-service/user-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/UserEntity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), NewUserModuleModule],
  controllers: [UserControllerController],
  providers: [UserService],
  exports: [UserService]
})
export class NewUserModuleModule {}
