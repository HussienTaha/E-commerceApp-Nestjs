import { TokenType } from 'src/common/enum';

import jwt, { JwtPayload, sign, SignOptions } from 'jsonwebtoken';
import { AppError } from '../errorhanseling';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HUserDocument, User } from 'src/DB';

export const generateToken = async ({
  payload,
  signature,
  options,
}: {
  payload: object;
  signature: string;
  options?: SignOptions;
}): Promise<string> => {
  return jwt.sign(payload, signature, options);
};

const verifyToken = async ({
  token,
  signature,
}: {
  token: string;
  signature: string;
}): Promise<JwtPayload> => {
  return jwt.verify(token, signature) as JwtPayload;
};

export class TokenService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepo: Model<HUserDocument>,
  ) {}

  getsegnature = async (
    prefix: string,
    tokenType: TokenType = TokenType.access,
  ) => {
    if (tokenType === TokenType.access) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.USER_SECRET;
      } else if (prefix === process.env.SUPER_ADMIN) {
        return process.env.SUPER_ADMIN_SECRET;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.ADMIN_SECRET;
      } else {
        null;
      }
    }

    if (tokenType === TokenType.refresh) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.USER_REFRESH_SECRET;
      } else if (prefix === process.env.SUPER_ADMIN) {
        return process.env.SUPER_ADMIN_REFRESH_SECRET;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.ADMIN_REFRESH_SECRET;
      } else {
        null;
      }
    }
    return null;
  };

  decodedTokenAndfitchUser = async (token: string, signature: string) => {
    //  هنا عاوز يضري err عشان بعمل decoded.email  ف هنا عملت اسه بص  decoded as JwtPayload
    //  طلع الغلط يا معلم ان انا مش  عالم await علي ال verig
    const decoded = await verifyToken({ token, signature });
    if (!decoded) {
      throw new AppError('Invalid token', 401);
    }
    // console.log( decoded);

    const user = await this.userRepo.findOne({ email: decoded.email });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // console.log( user);

    // console.log(user);

    if (!user.confermed) {
      throw new AppError('User not confirmed or is deleted', 401);
    }

    //     if (await _revokedModel.findOne({tokenId:decoded.jti})){
    //         throw new AppError("Token is revoked",401)
    //     }
    //      if(user?.changecredentials?.getDate()!>decoded?.iat!*1000){
    // throw new AppError("User change credentials and token is expired or is revoked",401)

    //     }

    return { user, decoded };
  };
}
