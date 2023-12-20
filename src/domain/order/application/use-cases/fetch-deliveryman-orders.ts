import { Either, right } from '@/core/either'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchDeliverymanOrdersUseCaseRequest {
  deliverymanId: string
  page: number
  perPage: number
}

type FetchDeliverymanOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchDeliverymanOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: FetchDeliverymanOrdersUseCaseRequest,
  ): Promise<FetchDeliverymanOrdersUseCaseResponse> {
    const { deliverymanId, page, perPage } = request

    const orders = await this.ordersRepository.findManyByDeliverymanId(
      deliverymanId,
      { page, perPage },
    )

    return right({
      orders,
    })
  }
}
