import { Module } from '@nestjs/common';
import { OsController } from './os.controller';
import { OsService } from './os.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/entity/links.entity';
import { User } from 'src/user/entity/user.entity';
import { Os } from './entity/os.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, User, Os])],
  controllers: [OsController],
  providers: [OsService]
})
export class OsModule {}
