import { createHash, type BinaryLike } from 'node:crypto';

export class CryptoUtils {
  static hashData(plainText: BinaryLike, algorithm = 'sha256') {
    const hashed = createHash(algorithm).update(plainText).digest('hex');
    return hashed;
  }
  static compareHash(plainText: BinaryLike, hashed: string, algorithm = 'sha256') {
    return this.hashData(plainText, algorithm) === hashed;
  }
}
