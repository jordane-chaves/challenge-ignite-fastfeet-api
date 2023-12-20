import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/order/application/repositories/orders-repository'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

import { InMemoryCustomerAddressesRepository } from './in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from './in-memory-customers-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryOrderImagesRepository } from './in-memory-order-images-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private orderImagesRepository: InMemoryOrderImagesRepository,
    private imagesRepository: InMemoryImagesRepository,
    private customersRepository: InMemoryCustomersRepository,
    private customerAddressesRepository: InMemoryCustomerAddressesRepository,
  ) {}

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.deliverymanId?.toString() === deliverymanId)
      .slice((page - 1) * perPage, page * perPage)

    return orders
  }

  async findManyByCustomerId(
    customerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.customerId.toString() === customerId)
      .slice((page - 1) * perPage, page * perPage)

    return orders
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 1

    const orders = this.items.filter((item) => {
      const customer = this.customersRepository.items.find((customer) =>
        customer.id.equals(item.customerId),
      )

      if (!customer) {
        throw new Error(
          `Customer with ID ${item.customerId.toString()} does not exist.`,
        )
      }

      const address = this.customerAddressesRepository.items.find((address) =>
        address.customerId.equals(customer.id),
      )

      if (!address) {
        throw new Error(`Customer address not found.`)
      }

      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: address.latitude,
          longitude: address.longitude,
        },
      )

      return distance < MAX_DISTANCE_IN_KILOMETERS
    })

    return orders
  }

  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    const customer = this.customersRepository.items.find((customer) =>
      customer.id.equals(order.customerId),
    )

    if (!customer) {
      throw new Error(
        `Customer with ID ${order.customerId.toString()} does not exist.`,
      )
    }

    const address = this.customerAddressesRepository.items.find((address) =>
      address.customerId.equals(order.customerId),
    )

    if (!address) {
      throw new Error(
        `Address for customer ID ${order.customerId.toString()} does not exist.`,
      )
    }

    const orderImage = this.orderImagesRepository.items.find((orderImage) =>
      orderImage.orderId.equals(order.id),
    )

    const image = this.imagesRepository.items.find(
      (image) => orderImage?.imageId.equals(image.id),
    )

    return OrderDetails.create({
      orderId: order.id,
      image: image?.url,
      deliveredAt: order.deliveredAt,
      postedAt: order.postedAt,
      returnedAt: order.returnedAt,
      withdrawnAt: order.withdrawnAt,
      description: order.description,
      customerId: customer.id,
      customer: customer.name,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      cep: address.cep,
    })
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = order

      if (order.image) {
        await this.orderImagesRepository.create(order.image)
      }

      DomainEvents.dispatchEventsForAggregate(order.id)
    }
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
      this.orderImagesRepository.deleteByOrderId(order.id.toString())
    }
  }
}
