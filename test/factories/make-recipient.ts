import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  RecipientProps,
  Recipient,
} from '@/domain/account/enterprise/entities/recipient'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
): Recipient {
  const cpf = faker.number
    .int({
      min: 10000000000,
      max: 99999999999,
    })
    .toString()
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')

  const recipient = Recipient.create(
    {
      name: faker.person.firstName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}) {
    const recipient = makeRecipient(data)

    await this.prisma.user.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}
