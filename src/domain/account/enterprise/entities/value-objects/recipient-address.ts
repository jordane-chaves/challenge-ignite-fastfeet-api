import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Address, AddressProps } from './address'

export interface RecipientAddressProps extends AddressProps {
  recipientId: UniqueEntityID
}

export class RecipientAddress extends Address<RecipientAddressProps> {
  get recipientId() {
    return this.props.recipientId
  }

  static create(props: RecipientAddressProps) {
    return new RecipientAddress(props)
  }
}
