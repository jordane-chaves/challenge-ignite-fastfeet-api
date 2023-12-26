import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'

export class BcryptHasher implements HashComparer, HashGenerator {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
