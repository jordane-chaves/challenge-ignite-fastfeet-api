import { OrderImagesRepository } from '@/domain/order/application/repositories/order-images-repository'
import { OrderImage } from '@/domain/order/enterprise/entities/order-image'

export class InMemoryOrderImagesRepository implements OrderImagesRepository {
  public items: OrderImage[] = []

  async deleteByOrderId(orderId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.orderId.toString() === orderId,
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }

  async create(orderImage: OrderImage): Promise<void> {
    this.items.push(orderImage)
  }
}
