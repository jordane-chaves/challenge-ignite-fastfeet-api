import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'

import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDeliverymenRepository implements DeliverymenRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrismaUpdate(deliveryman)

    await this.prisma.user.update(data)
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryman.id.toString(),
      },
    })
  }
}
