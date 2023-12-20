import { UseCaseError } from '@/core/errors/use-case-error'

export class RequiredImageError extends Error implements UseCaseError {
  constructor() {
    super('The image is required.')
  }
}
