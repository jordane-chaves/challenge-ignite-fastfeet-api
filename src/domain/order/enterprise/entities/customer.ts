import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CustomerAddress } from './value-objects/customer-address'

export interface CustomerProps {
  name: string
  address?: CustomerAddress | null
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(props, id)

    return customer
  }
}
