import { PaginationParams } from '@/core/repositories/pagination-params'

import { Order } from '../../enterprise/entities/order'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface OrdersRepository {
  findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  findDetailsById(id: string): Promise<OrderDetails | null>
  findById(id: string): Promise<Order | null>
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
