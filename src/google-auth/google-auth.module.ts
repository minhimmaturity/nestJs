import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { GoogleStrategy } from './google.stargery';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy]
})
export class GoogleAuthModule {}
