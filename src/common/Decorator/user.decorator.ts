import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
@ValidatorConstraint({ name: 'customText', async: false })
export class matchFeilds implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    console.log(text ,args);
    
    return text === args.object[args.constraints[0]]; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} do not match ${args.constraints[0]}`;
  }
}
export function IsMatch(constraints:string[],validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: matchFeilds,
    });
    console.log({registerDecorator});
    
  };
}





export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
