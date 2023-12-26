import { Image } from '@/domain/order/enterprise/entities/image'
import { Prisma } from '@prisma/client'

export class PrismaImageMapper {
  static toPrisma(image: Image): Prisma.ImageUncheckedCreateInput {
    return {
      id: image.id.toString(),
      title: image.title,
      url: image.url,
    }
  }
}
