import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderProps, Order } from '@/domain/order/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
): Order {
  return Order.create(
    {
      customerId: new UniqueEntityID(),
      description: faker.commerce.product(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}) {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}
