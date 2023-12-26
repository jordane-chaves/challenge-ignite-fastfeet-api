import { Recipient } from '@/domain/account/enterprise/entities/recipient'
import { Prisma } from '@prisma/client'

export class PrismaRecipientMapper {
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
