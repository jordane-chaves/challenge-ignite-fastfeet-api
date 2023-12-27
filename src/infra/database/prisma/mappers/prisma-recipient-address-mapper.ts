import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RecipientAddress } from '@/domain/account/enterprise/entities/value-objects/recipient-address'
import { Prisma, Address as PrismaAddress } from '@prisma/client'

export class PrismaRecipientAddressMapper {
  static toDomain(raw: PrismaAddress): RecipientAddress {
    return RecipientAddress.create({
      recipientId: new UniqueEntityID(raw.recipientId),
      cep: raw.cep,
      city: raw.city,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      neighborhood: raw.neighborhood,
      number: raw.number,
      street: raw.street,
    })
  }

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
