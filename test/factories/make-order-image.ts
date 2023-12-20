import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderImage,
  OrderImageProps,
} from '@/domain/order/enterprise/entities/order-image'

export function makeOrderImage(
  override: Partial<OrderImageProps> = {},
  id?: UniqueEntityID,
) {
  return OrderImage.create(
    {
      imageId: new UniqueEntityID(),
      orderId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}
