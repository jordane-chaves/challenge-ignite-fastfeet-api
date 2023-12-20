import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrdersRepository } from '../repositories/orders-repository'

interface DeleteOrderUseCaseRequest {
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: DeleteOrderUseCaseRequest,
  ): Promise<DeleteOrderUseCaseResponse> {
    const { orderId } = request

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    await this.ordersRepository.delete(order)

    return right(null)
  }
}
