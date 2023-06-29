import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Req } from '@nestjs/common';
import { profile } from 'console';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '178388781095-1760o374nt0atigbbo4def8iok1knks7.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:4000/auth/login',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }
    done(null, user);
  }
  
}
