
import { USER_ROLE } from "src/common/enum";
import { AppError } from '../errorhanseling';


export const getRoleAccessSignature = (role: USER_ROLE): string => {
  switch (role) {
    case USER_ROLE.USER:
      return process.env.USER_SECRET as string;

    case USER_ROLE.ADMIN:
      return process.env.ADMIN_SECRET as string;

    case USER_ROLE.SUPER_ADMIN:
      return process.env.SUPER_ADMIN_SECRET as string;

    default:
      throw new AppError("Invalid role 😒😒" , 400);
  }
};



export const getRoleRefreshSignature = (role: USER_ROLE): string => {
  switch (role) {
    case USER_ROLE.USER:
      return process.env.USER_REFRESH_SECRET as string;

    case USER_ROLE.ADMIN:
      return process.env.ADMIN_REFRESH_SECRET as string;

    case USER_ROLE.SUPER_ADMIN:
      return process.env.SUPER_ADMIN_REFRESH_SECRET as string;

    default:
      throw new Error("Invalid role 😒😒");
  }
};
