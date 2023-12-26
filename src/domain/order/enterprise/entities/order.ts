import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { OrderDeliveredEvent } from '../events/order-delivered'
import { OrderPostedEvent } from '../events/order-posted'
import { OrderReturnedEvent } from '../events/order-returned'
import { OrderWithdrawnEvent } from '../events/order-withdrawn'
import { OrderImage } from './order-image'

export interface OrderProps {
  customerId: UniqueEntityID
  deliverymanId?: UniqueEntityID | null
  description: string
  image?: OrderImage | null
  postedAt?: Date | null
  withdrawnAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get customerId() {
    return this.props.customerId
  }

  set customerId(customerId: UniqueEntityID) {
    this.props.customerId = customerId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get image() {
    return this.props.image
  }

  set image(image: OrderImage | null | undefined) {
    this.props.image = image
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

  post() {
    if (!this.props.postedAt) {
      this.addDomainEvent(new OrderPostedEvent(this))
    }

    this.props.postedAt = new Date()
  }

  withdraw(deliverymanId: UniqueEntityID) {
    if (!this.props.withdrawnAt) {
      this.addDomainEvent(new OrderWithdrawnEvent(this))
    }

    this.props.deliverymanId = deliverymanId
    this.props.withdrawnAt = new Date()
  }

  deliver() {
    if (!this.props.deliveredAt) {
      this.addDomainEvent(new OrderDeliveredEvent(this))
    }

    this.props.deliveredAt = new Date()
  }

  return() {
    if (!this.props.returnedAt) {
      this.addDomainEvent(new OrderReturnedEvent(this))
    }

    this.props.returnedAt = new Date()
  }

  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id)

    return order
  }
}
