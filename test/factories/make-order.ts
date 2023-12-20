import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderProps, Order } from '@/domain/order/enterprise/entities/order'
import { faker } from '@faker-js/faker'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
): Order {
  return Order.create(
    {
      customerId: new UniqueEntityID(),
      description: faker.commerce.product(),
      ...override,
    },
    id,
  )
}
