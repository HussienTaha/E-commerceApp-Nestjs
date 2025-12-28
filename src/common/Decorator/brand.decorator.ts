import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,

} from 'class-validator';


export function AtlastOne(
  requerFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function, ) {
    registerDecorator({
      target: constructor,
      propertyName: '',
      options: validationOptions,
      constraints: requerFields,
      validator: {
        validate(text: string, args: ValidationArguments) {
          console.log(text, args);

          return requerFields.some((field) => args.object[field]); // for async validations you must return a Promise<boolean> here
        },

        defaultMessage(args: ValidationArguments) {
          // here you can provide default error message if validation failed
          return `At least one of the following fields must be provided: ${requerFields.join(' , ')}`;
        },
      },
    });
  };
}
