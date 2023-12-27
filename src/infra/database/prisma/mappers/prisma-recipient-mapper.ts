import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/account/enterprise/entities/recipient'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaUser): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: CPF.create(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(recipient: Recipient): Prisma.UserUpdateArgs {
    return {
      where: {
        id: recipient.id.toString(),
      },
      data: {
        name: recipient.name,
        cpf: recipient.cpf.value,
        password: recipient.password,
      },
    }
  }

  static toPrisma(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value,
      password: recipient.password,
      role: 'RECIPIENT',
    }
  }
}
