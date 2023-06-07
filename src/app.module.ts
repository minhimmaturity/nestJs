import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dbConfig from 'typeorm.config';
import { User } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { JwtStrategy } from './auth/guards/auth.strategy';
import { ConfigModule } from '@nestjs/config';
import { LinksModule } from './links/links.module';
import { Link } from './links/entity/links.entity';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([User, Link]),
    AuthModule,
    UserModule,
    LinksModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtStrategy,
    MailService
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
