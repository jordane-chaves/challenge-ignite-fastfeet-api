import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/order/enterprise/entities/order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        customerId: new UniqueEntityID(raw.recipientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        description: raw.description,
        postedAt: raw.postedAt,
        withdrawnAt: raw.withdrawnAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.customerId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      description: order.description,
      postedAt: order.postedAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
    }
  }
}
