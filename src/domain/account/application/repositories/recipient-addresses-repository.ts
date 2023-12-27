import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'

export abstract class RecipientAddressesRepository {
  abstract findByRecipientId(
    recipientId: string,
  ): Promise<RecipientAddress | null>

  abstract create(recipientAddress: RecipientAddress): Promise<void>
  abstract deleteByRecipientId(recipientId: string): Promise<void>
}
