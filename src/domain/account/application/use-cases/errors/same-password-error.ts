import { UseCaseError } from '@/core/errors/use-case-error'

export class SamePasswordError extends Error implements UseCaseError {
  constructor() {
    super('The password cannot be the same.')
  }
}
