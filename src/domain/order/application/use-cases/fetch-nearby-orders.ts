import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchNearbyOrdersUseCaseRequest {
  deliverymanLatitude: number
  deliverymanLongitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: FetchNearbyOrdersUseCaseRequest,
  ): Promise<FetchNearbyOrdersUseCaseResponse> {
    const { deliverymanLatitude, deliverymanLongitude } = request

    const orders = await this.ordersRepository.findManyNearby({
      latitude: deliverymanLatitude,
      longitude: deliverymanLongitude,
    })

    return right({
      orders,
    })
  }
}
