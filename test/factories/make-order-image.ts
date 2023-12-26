import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderImage,
  OrderImageProps,
} from '@/domain/order/enterprise/entities/order-image'
import { PrismaOrderImageMapper } from '@/infra/database/prisma/mappers/prisma-order-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class OrderImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderImage(data: Partial<OrderImageProps> = {}) {
    const orderImage = makeOrderImage(data)

    await this.prisma.image.update({
      where: {
        id: orderImage.imageId.toString(),
      },
      data: PrismaOrderImageMapper.toPrismaUpdate(orderImage),
    })

    return orderImage
  }
}
