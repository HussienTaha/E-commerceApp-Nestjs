
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../service/errorhanseling';
import { TokenService } from '../service/token';
import { userRequst } from '../interfaces';
import { TokenType } from '../enum';



export const useTypeToken =( TypeToken:TokenType=TokenType.access )=>{
  return (req: userRequst, res: Response, next: NextFunction) =>{
    req.TypeToken=TypeToken
    next()
  }
}



@Injectable()
export class authantication implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: userRequst, res: Response, next: NextFunction) {

    try {
        const { authorization } = req.headers;

    const [prefix, token] = authorization?.split(" ") || [];
    if (!prefix || !token) {
      throw new AppError("Invalid authorization header format", 401);
    }

    const signature = await this.tokenService.getsegnature(prefix, req.TypeToken);

    if (!signature) {
      throw new AppError("Invalid signature not found", 401);
    }

    const { user, decoded } =
      await this.tokenService.decodedTokenAndfitchUser(token, signature);

    if (!decoded) {
      throw new AppError("Invalid token decoded or user not found", 401);
    }

    req.user = user;
    req.decoded = decoded;

    return next();
    }
    catch (error) {
      throw new AppError(error.message || "Invalid segnature", 401);
    }
  
  }
}
