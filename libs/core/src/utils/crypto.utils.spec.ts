import { CryptoUtils } from './crypto.utils';

describe('CryptoUtils', () => {
  test('should hash and compare data correctly', () => {
    const originalString = 'Hello, world!';
    const hashedString = CryptoUtils.hashData(originalString);

    // Test hashing
    expect(hashedString).toBeDefined();
    expect(typeof hashedString).toBe('string');

    // Test comparison
    const testString = 'Hello, world!';
    const isMatch = CryptoUtils.compareHash(testString, hashedString);
    expect(isMatch).toBe(true);

    const mismatchString = 'Hello, OpenAI!';
    const isMismatch = CryptoUtils.compareHash(mismatchString, hashedString);
    expect(isMismatch).toBe(false);
  });

  test('should hash and compare data correctly with custom algorithm', () => {
    const originalString = 'Hello, world!';
    const customAlgorithm = 'md5';
    const hashedString = CryptoUtils.hashData(originalString, customAlgorithm);

    // Test hashing
    expect(hashedString).toBeDefined();
    expect(typeof hashedString).toBe('string');

    // Test comparison
    const testString = 'Hello, world!';
    const isMatch = CryptoUtils.compareHash(testString, hashedString, customAlgorithm);
    expect(isMatch).toBe(true);

    const mismatchString = 'Hello, OpenAI!';
    const isMismatch = CryptoUtils.compareHash(mismatchString, hashedString, customAlgorithm);
    expect(isMismatch).toBe(false);
  });
});
