import { Either, right } from '@/core/either'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchCustomerOrdersUseCaseRequest {
  customerId: string
  page: number
  perPage: number
}

type FetchCustomerOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchCustomerOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: FetchCustomerOrdersUseCaseRequest,
  ): Promise<FetchCustomerOrdersUseCaseResponse> {
    const { customerId, page, perPage } = request

    const orders = await this.ordersRepository.findManyByCustomerId(
      customerId,
      { page, perPage },
    )

    return right({
      orders,
    })
  }
}
