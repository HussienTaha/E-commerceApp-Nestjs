import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Decorator';
import { USER_ROLE } from '../enum';


@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const allowedRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // لو مفيش Roles → السماح
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You are not allowed');
    }

    return true;
  }
}
