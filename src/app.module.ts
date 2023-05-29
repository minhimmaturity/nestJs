import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewUserModuleModule } from './new-user-module/new-user-module.module';

@Module({
  imports: [NewUserModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
