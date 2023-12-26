import { OrderImage } from '@/domain/order/enterprise/entities/order-image'
import { Prisma } from '@prisma/client'

export class PrismaOrderImageMapper {
  static toPrismaUpdate(
    orderImage: OrderImage,
  ): Prisma.ImageUncheckedUpdateInput {
    return {
      orderId: orderImage.orderId.toString(),
    }
  }
}
