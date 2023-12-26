import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'
import {
  Order as PrismaOrder,
  User as PrismaUser,
  Address as PrismaAddress,
  Image as PrismaImage,
} from '@prisma/client'

type PrismaOrderDetails = PrismaOrder & {
  image: PrismaImage | null
  recipient: PrismaUser & {
    address: PrismaAddress | null
  }
}

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    if (!raw.recipient.address) {
      throw new Error('Invalid recipient address.')
    }

    return OrderDetails.create({
      orderId: new UniqueEntityID(raw.id),
      description: raw.description,
      postedAt: raw.postedAt,
      withdrawnAt: raw.withdrawnAt,
      deliveredAt: raw.deliveredAt,
      returnedAt: raw.returnedAt,
      image: raw.image?.url,
      customerId: new UniqueEntityID(raw.recipientId),
      customer: raw.recipient.name,
      street: raw.recipient.address.street,
      number: raw.recipient.address.number,
      neighborhood: raw.recipient.address.neighborhood,
      city: raw.recipient.address.city,
      cep: raw.recipient.address.cep,
    })
  }
}
