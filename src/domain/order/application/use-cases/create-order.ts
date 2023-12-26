import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { CustomersRepository } from '../repositories/customers-repository'
import { OrdersRepository } from '../repositories/orders-repository'

interface CreateOrderUseCaseRequest {
  customerId: string
  description: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
  ) {}

  async execute(
    request: CreateOrderUseCaseRequest,
  ): Promise<CreateOrderUseCaseResponse> {
    const { customerId, description } = request

    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      customerId: new UniqueEntityID(customerId),
      description,
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
