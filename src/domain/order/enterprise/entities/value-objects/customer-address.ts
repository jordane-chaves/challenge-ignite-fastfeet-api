import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Address, AddressProps } from './address'

export interface CustomerAddressProps extends AddressProps {
  customerId: UniqueEntityID
}

export class CustomerAddress extends Address<CustomerAddressProps> {
  get customerId() {
    return this.props.customerId
  }

  static create(props: CustomerAddressProps) {
    return new CustomerAddress(props)
  }
}
