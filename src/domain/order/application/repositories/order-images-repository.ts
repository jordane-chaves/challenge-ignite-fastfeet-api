import { OrderImage } from '../../enterprise/entities/order-image'

export interface OrderImagesRepository {
  deleteByOrderId(orderId: string): Promise<void>
  create(orderImage: OrderImage): Promise<void>
}
