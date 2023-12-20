import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderImageProps {
  imageId: UniqueEntityID
  orderId: UniqueEntityID
}

export class OrderImage extends Entity<OrderImageProps> {
  get imageId() {
    return this.props.imageId
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: OrderImageProps, id?: UniqueEntityID) {
    const orderImage = new OrderImage(props, id)

    return orderImage
  }
}
