import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/order/application/repositories/orders-repository'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'
import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'

import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByCustomerId(
    customerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        recipientId: customerId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * FROM orders
        JOIN users ON users.id = orders.recipient_id
        JOIN addresses ON addresses.recipient_id = users.id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        recipient: {
          include: {
            address: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderDetailsMapper.toDomain(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    })
  }
}
