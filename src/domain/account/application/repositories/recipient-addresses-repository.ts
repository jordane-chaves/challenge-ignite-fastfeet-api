import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'

export interface RecipientAddressesRepository {
  findByRecipientId(recipientId: string): Promise<RecipientAddress | null>
  create(recipientAddress: RecipientAddress): Promise<void>
  deleteByRecipientId(recipientId: string): Promise<void>
}
