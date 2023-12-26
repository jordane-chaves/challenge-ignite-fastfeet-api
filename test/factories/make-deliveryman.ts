import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliverymanProps,
  Deliveryman,
} from '@/domain/account/enterprise/entities/deliveryman'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
): Deliveryman {
  const cpf = faker.number
    .int({
      min: 10000000000,
      max: 99999999999,
    })
    .toString()
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')

  return Deliveryman.create(
    {
      name: faker.person.firstName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(data: Partial<DeliverymanProps> = {}) {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
