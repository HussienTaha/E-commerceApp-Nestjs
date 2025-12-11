import { HttpException } from "@nestjs/common";

export class AppError extends HttpException {
  constructor(message: string, status?: number) {
    super(message, status!);
  }
}