import { SetMetadata } from '@nestjs/common';
import { TokenType, USER_ROLE } from '../enum';
  export const TokenName = 'tokentype';
export const Token = (tokentype: TokenType = TokenType.access) => {
  return SetMetadata(TokenName, tokentype);
};

export const ROLES_KEY = 'access_roles';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata(ROLES_KEY, roles);
 