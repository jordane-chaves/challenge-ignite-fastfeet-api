import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { OrderNotPostedError } from './errors/order-not-posted-error'

interface WithdrawOrderUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type WithdrawOrderUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotPostedError,
  {
    order: Order
  }
>

@Injectable()
export class WithdrawOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: WithdrawOrderUseCaseRequest,
  ): Promise<WithdrawOrderUseCaseResponse> {
    const { deliverymanId, orderId } = request

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const isOrderPosted = order.postedAt

    if (!isOrderPosted) {
      return left(new OrderNotPostedError())
    }

    order.withdraw(new UniqueEntityID(deliverymanId))

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
