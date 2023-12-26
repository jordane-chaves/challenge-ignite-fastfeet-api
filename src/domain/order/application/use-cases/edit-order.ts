import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface EditOrderUseCaseRequest {
  orderId: string
  customerId: string
  description: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: EditOrderUseCaseRequest,
  ): Promise<EditOrderUseCaseResponse> {
    const { customerId, orderId, description } = request

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.customerId = new UniqueEntityID(customerId)
    order.description = description

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
