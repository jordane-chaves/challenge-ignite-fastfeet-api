import { RecipientAddressesRepository } from '@/domain/account/application/repositories/recipient-addresses-repository'
import { RecipientsRepository } from '@/domain/account/application/repositories/recipients-repository'
import { Recipient } from '@/domain/account/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(
    private prisma: PrismaService,
    private recipientAddressesRepository: RecipientAddressesRepository,
  ) {}

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.create({
      data,
    })

    if (recipient.address) {
      await this.recipientAddressesRepository.create(recipient.address)
    }
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrismaUpdate(recipient)

    await this.prisma.user.update(data)

    if (recipient.address) {
      await this.recipientAddressesRepository.deleteByRecipientId(
        recipient.id.toString(),
      )

      await this.recipientAddressesRepository.create(recipient.address)
    }
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: recipient.id.toString(),
      },
    })
  }
}
