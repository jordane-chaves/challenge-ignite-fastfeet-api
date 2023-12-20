import { RecipientAddressesRepository } from '@/domain/account/application/repositories/recipient-addresses-repository'
import { RecipientAddress } from '@/domain/account/enterprise/entities/value-objects/recipient-address'

export class InMemoryRecipientAddressesRepository
  implements RecipientAddressesRepository
{
  public items: RecipientAddress[] = []

  async findByRecipientId(
    recipientId: string,
  ): Promise<RecipientAddress | null> {
    const recipientAddress = this.items.find(
      (item) => item.recipientId.toString() === recipientId,
    )

    if (!recipientAddress) {
      return null
    }

    return recipientAddress
  }

  async create(recipientAddress: RecipientAddress): Promise<void> {
    this.items.push(recipientAddress)
  }

  async deleteByRecipientId(recipientId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.recipientId.toString() === recipientId,
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
