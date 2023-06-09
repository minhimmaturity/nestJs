import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtStrategy } from 'src/auth/guards/auth.strategy';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { LinksService } from 'src/links/links.service';
import { LinksModule } from 'src/links/links.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtService, MailService],
  exports: [UserService, JwtService],
})
export class UserModule {}
