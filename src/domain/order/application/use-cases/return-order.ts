import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface ReturnOrderUseCaseRequest {
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: ReturnOrderUseCaseRequest,
  ): Promise<ReturnOrderUseCaseResponse> {
    const { orderId } = request

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.return()

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
