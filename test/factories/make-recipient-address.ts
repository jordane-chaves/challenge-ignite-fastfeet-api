import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  RecipientAddressProps,
  RecipientAddress,
} from '@/domain/account/enterprise/entities/value-objects/recipient-address'
import { PrismaRecipientAddressMapper } from '@/infra/database/prisma/mappers/prisma-recipient-address-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipientAddress(
  override: Partial<RecipientAddressProps> = {},
): RecipientAddress {
  const recipientAddress = RecipientAddress.create({
    recipientId: new UniqueEntityID(),
    city: faker.location.city(),
    neighborhood: faker.location.county(),
    street: faker.location.street(),
    cep: faker.number.int().toString(),
    number: faker.number.int({ min: 1, max: 1000 }),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override,
  })

  return recipientAddress
}

@Injectable()
export class RecipientAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipientAddress(data: Partial<RecipientAddressProps> = {}) {
    const recipientAddress = makeRecipientAddress(data)

    await this.prisma.address.create({
      data: PrismaRecipientAddressMapper.toPrisma(recipientAddress),
    })

    return recipientAddress
  }
}
