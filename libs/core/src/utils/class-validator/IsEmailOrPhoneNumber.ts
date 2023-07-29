import {
  isEmail,
  isPhoneNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsEmailOrPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return typeof value === 'string' && (isEmail(value) || isPhoneNumber(value));
  }
}

export function IsEmailOrPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailOrPhoneNumberConstraint,
    });
  };
}
