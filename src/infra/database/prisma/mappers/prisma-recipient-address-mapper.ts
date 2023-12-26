import { RecipientAddress } from '@/domain/account/enterprise/entities/value-objects/recipient-address'
import { Prisma } from '@prisma/client'

export class PrismaRecipientAddressMapper {
  static toPrisma(
    recipientAddress: RecipientAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      recipientId: recipientAddress.recipientId.toString(),
      street: recipientAddress.street,
      number: recipientAddress.number,
      neighborhood: recipientAddress.neighborhood,
      city: recipientAddress.city,
      cep: recipientAddress.cep,
      latitude: recipientAddress.latitude,
      longitude: recipientAddress.longitude,
    }
  }
}
