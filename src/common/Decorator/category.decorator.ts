import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { Types } from "mongoose";

@ValidatorConstraint({ name: 'IdsMongo', async: false })
export class Idsmongo implements ValidatorConstraintInterface {
  validate(ids: string[], args: ValidationArguments) {
    

    return ids.filter((id) => Types.ObjectId.isValid(id)).length === ids.length; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `All provided IDs must be valid MongoDB ObjectIds`;
  }
}







