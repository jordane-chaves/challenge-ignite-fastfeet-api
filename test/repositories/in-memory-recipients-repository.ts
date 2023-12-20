import { RecipientsRepository } from '@/domain/account/application/repositories/recipients-repository'
import { Recipient } from '@/domain/account/enterprise/entities/recipient'

import { InMemoryRecipientAddressesRepository } from './in-memory-recipient-addresses-repository'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  constructor(
    private recipientAddressesRepository: InMemoryRecipientAddressesRepository,
  ) {}

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.cpf.value === cpf)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)

    if (recipient.address) {
      this.recipientAddressesRepository.create(recipient.address)
    }
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === recipient.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = recipient

      if (recipient.address) {
        this.recipientAddressesRepository.deleteByRecipientId(
          recipient.id.toString(),
        )

        this.recipientAddressesRepository.create(recipient.address)
      }
    }
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === recipient.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)

      await this.recipientAddressesRepository.deleteByRecipientId(
        recipient.id.toString(),
      )
    }
  }
}
