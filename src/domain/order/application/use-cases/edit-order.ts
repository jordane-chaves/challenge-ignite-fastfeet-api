import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface EditOrderUseCaseRequest {
  orderId: string
  description: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class EditOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: EditOrderUseCaseRequest,
  ): Promise<EditOrderUseCaseResponse> {
    const { orderId, description } = request

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.description = description

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
