import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderNotPostedError extends Error implements UseCaseError {
  constructor() {
    super('Order not posted.')
  }
}
