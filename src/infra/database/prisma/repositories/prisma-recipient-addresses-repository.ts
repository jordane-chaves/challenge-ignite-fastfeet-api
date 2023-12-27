import { RecipientAddressesRepository } from '@/domain/account/application/repositories/recipient-addresses-repository'
import { RecipientAddress } from '@/domain/account/enterprise/entities/value-objects/recipient-address'
import { Injectable } from '@nestjs/common'

import { PrismaRecipientAddressMapper } from '../mappers/prisma-recipient-address-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientAddressesRepository
  implements RecipientAddressesRepository
{
  constructor(private prisma: PrismaService) {}

  async findByRecipientId(
    recipientId: string,
  ): Promise<RecipientAddress | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        recipientId,
      },
    })

    if (!address) {
      return null
    }

    return PrismaRecipientAddressMapper.toDomain(address)
  }

  async create(recipientAddress: RecipientAddress): Promise<void> {
    const data = PrismaRecipientAddressMapper.toPrisma(recipientAddress)

    await this.prisma.address.create({
      data,
    })
  }

  async deleteByRecipientId(recipientId: string): Promise<void> {
    await this.prisma.address.delete({
      where: {
        recipientId,
      },
    })
  }
}
