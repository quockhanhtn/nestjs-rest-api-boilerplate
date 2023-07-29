import { IsEmailOrPhoneNumberConstraint } from './IsEmailOrPhoneNumber';

describe('IsEmailOrPhoneNumberConstraint', () => {
  it('should return true if the value is a string and is either an email or a phone number', () => {
    const constraint = new IsEmailOrPhoneNumberConstraint();
    const value = 'test@example.com';
    const result = constraint.validate(value, undefined);
    expect(result).toBe(true);
  });

  it('should return false if the value is not a string', () => {
    const constraint = new IsEmailOrPhoneNumberConstraint();
    const value = 1234;
    const result = constraint.validate(value, undefined);
    expect(result).toBe(false);
  });

  it('should return false if the value is a string but is not an email or a phone number', () => {
    const constraint = new IsEmailOrPhoneNumberConstraint();
    const value = 'this is not an email or a phone number';
    const result = constraint.validate(value, undefined);
    expect(result).toBe(false);
  });
});
