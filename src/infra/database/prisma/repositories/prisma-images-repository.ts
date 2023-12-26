import { ImagesRepository } from '@/domain/order/application/repositories/images-repository'
import { Image } from '@/domain/order/enterprise/entities/image'
import { Injectable } from '@nestjs/common'

import { PrismaImageMapper } from '../mappers/prisma-image-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(image: Image): Promise<void> {
    const data = PrismaImageMapper.toPrisma(image)

    await this.prisma.image.create({
      data,
    })
  }
}
