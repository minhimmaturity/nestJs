import { Injectable, UnauthorizedException } from '@nestjs/common';

// import { UserService } from "./../../../../..//src/user/user.service";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { authService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { UserEntity } from 'src/user/entity/UserEntity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: authService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload.sub)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
