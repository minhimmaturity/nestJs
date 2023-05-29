import { Module } from '@nestjs/common';
import { UserControllerController } from './user-controller/user-controller.controller';
import { UserService } from './user-service/user-service';

@Module({
  controllers: [UserControllerController],
  providers: [UserService]
})
export class NewUserModuleModule {}
