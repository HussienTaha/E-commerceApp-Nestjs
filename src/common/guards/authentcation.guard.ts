import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from '../service/token';
import { AppError } from '../service/errorhanseling';
import { Reflector } from '@nestjs/core';
import { TokenName } from '../Decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const Ttype=this.reflector.get(TokenName,context.getHandler())
    let req: any;

    let authorization: string = '';

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req.headers.authorization!;
    }
    if (!authorization) {
      throw new AppError('Authorization header missing', 401);
    }

    const [prefix, token] = authorization.split(' ');

    if (!prefix || !token) {
      throw new AppError('Invalid authorization format', 401);
    }

    const signature = await this.tokenService.getsegnature(prefix, Ttype);

    if (!signature) {
      throw new AppError('Invalid signature', 401);
    }

    const { user, decoded } = await this.tokenService.decodedTokenAndfitchUser(
      token,
      signature,
    );

    if (!decoded || !user) {
      throw new AppError('Invalid token', 401);
    }

    req.user = user;
    req.decoded = decoded; 

    return true;
  }
}
