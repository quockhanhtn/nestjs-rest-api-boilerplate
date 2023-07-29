import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsAtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments) {
    const obj = args.object as any;
    const fields = args.constraints as Array<string>;

    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldValue = obj[fieldName];

      if (fieldValue && typeof fieldValue !== 'undefined' && fieldValue !== null) {
        return true;
      }
    }

    return false;
  }
}

export function IsAtLeastOneField(fields: Array<string>, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAtLeastOneField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: fields,
      options: validationOptions,
      validator: IsAtLeastOneFieldConstraint,
    });
  };
}
