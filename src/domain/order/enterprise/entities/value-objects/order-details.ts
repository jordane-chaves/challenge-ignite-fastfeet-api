import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface OrderDetailsProps {
  orderId: UniqueEntityID
  description: string
  image?: string | null
  postedAt?: Date | null
  withdrawnAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  customerId: UniqueEntityID
  customer: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get description() {
    return this.props.description
  }

  get image() {
    return this.props.image
  }

  get postedAt() {
    return this.props.postedAt
  }

  get withdrawnAt() {
    return this.props.withdrawnAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  get customerId() {
    return this.props.customerId
  }

  get customer() {
    return this.props.customer
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get cep() {
    return this.props.cep
  }

  static create(props: OrderDetailsProps) {
    const orderDetails = new OrderDetails(props)

    return orderDetails
  }
}
