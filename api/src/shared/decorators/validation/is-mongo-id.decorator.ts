import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

export function IsMongoId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsMongoIdConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsMongoId' })
export class IsMongoIdConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    return Types.ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.value} has invalid structure`;
  }
}
