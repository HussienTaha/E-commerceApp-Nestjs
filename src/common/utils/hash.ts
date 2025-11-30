import { compare, hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  return await hash(password, +(process.env.SALT_ROUNDS as string));
};



export const comparePassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword);
};