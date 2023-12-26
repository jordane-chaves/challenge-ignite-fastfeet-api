import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

export class OrderDetailsPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      orderId: orderDetails.orderId.toString(),
      description: orderDetails.description,
      image: orderDetails.image,
      postedAt: orderDetails.postedAt,
      withdrawnAt: orderDetails.withdrawnAt,
      deliveredAt: orderDetails.deliveredAt,
      returnedAt: orderDetails.returnedAt,
      customerId: orderDetails.customerId.toString(),
      customer: orderDetails.customer,
      street: orderDetails.street,
      number: orderDetails.number,
      neighborhood: orderDetails.neighborhood,
      city: orderDetails.city,
      cep: orderDetails.cep,
    }
  }
}
