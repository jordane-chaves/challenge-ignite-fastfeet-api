import { Order } from '@/domain/order/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      description: order.description,
      postedAt: order.postedAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
    }
  }
}
