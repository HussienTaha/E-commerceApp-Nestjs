
import { PipeTransform, ArgumentMetadata, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import {  ZodType  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
 
      const { error, success} = this.schema.safeParse(value);
  if (!success) {
    throw new HttpException(
        {
            message:"Validation Error",
            errors: error.issues.map((issue) => ({
                path: issue.path,
                message: issue.message
            }))

        }
        
        ,HttpStatus.BAD_REQUEST);
  }
    return value;

  }
}
