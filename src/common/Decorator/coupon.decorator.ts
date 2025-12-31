import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'CouponValidator', async: false })
export class CouponValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as any;

    const fromDate = new Date(obj.fromDate);
    const toDate = new Date(obj.toDate);
    const now = new Date();

    return fromDate >= now && fromDate < toDate;
  }
  

  defaultMessage(args: ValidationArguments): string {
    return 'fromDate should be greater than or equal to now and less than toDate';
  }
}
