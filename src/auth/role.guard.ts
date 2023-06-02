import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decoraters';
import { Role } from 'src/user/enum/role.enum';
import { JwtPayload } from 'jsonwebtoken';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken'

interface DecodedToken extends JwtPayload {
  roles: string[]; // Adjust the type of 'roles' based on your JWT payload structure
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as DecodedToken; // Provide the DecodedToken type
      const userRoles = decodedToken.roles;
      
      return requiredRoles.some((role) => userRoles?.includes(role));
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
