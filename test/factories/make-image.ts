import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/order/enterprise/entities/image'
import { PrismaImageMapper } from '@/infra/database/prisma/mappers/prisma-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeImage(
  override: Partial<ImageProps> = {},
  id?: UniqueEntityID,
): Image {
  return Image.create(
    {
      title: faker.lorem.word(),
      url: faker.image.url(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class ImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaImage(data: Partial<ImageProps> = {}) {
    const image = makeImage(data)

    await this.prisma.image.create({
      data: PrismaImageMapper.toPrisma(image),
    })

    return image
  }
}
