import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { authService } from "./auth/service/auth.service";
import { jwtConstants } from "./auth/constants";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/auth/auth/model/UserEntity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: authService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConstants.secret
    })
  }

  async validate({name}): Promise<any> {
    const user = await this.authService.validateUser(name);

    if (!user) {
        throw new UnauthorizedException();
    }

    return user;
  }
}