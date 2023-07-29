import { IsAtLeastOneFieldConstraint } from './IsAtLeastOneField';

describe('IsAtLeastOneFieldConstraint', () => {
  it('should return true if all fields is not null or undefined', () => {
    const obj = {
      name: 'John Doe',
      age: 30,
    };
    const fields = ['name', 'age'];

    const constraint = new IsAtLeastOneFieldConstraint();
    const result = constraint.validate(undefined, {
      object: obj,
      constraints: fields,
      value: undefined,
      targetName: '',
      property: '',
    });
    expect(result).toBe(true);
  });

  it('should return true if at least one field is not null or undefined', () => {
    const obj = {
      name: 'John Doe',
    };
    const fields = ['name', 'age'];

    const constraint = new IsAtLeastOneFieldConstraint();
    const result = constraint.validate(undefined, {
      object: obj,
      constraints: fields,
      value: undefined,
      targetName: '',
      property: '',
    });
    expect(result).toBe(true);
  });

  it('should return false if all fields are null or undefined', () => {
    const obj = {};
    const fields = ['name', 'age'];

    const constraint = new IsAtLeastOneFieldConstraint();
    const result = constraint.validate(undefined, {
      object: obj,
      constraints: fields,
      value: undefined,
      targetName: '',
      property: '',
    });
    expect(result).toBe(false);
  });
});
