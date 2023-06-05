import { Injectable, UnauthorizedException } from '@nestjs/common';

// import { UserService } from "./../../../../..//src/user/user.service";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { authService } from '../auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException('Minh');
    }
    return user;
  }
}
