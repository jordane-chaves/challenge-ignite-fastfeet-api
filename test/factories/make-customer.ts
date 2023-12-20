import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomerProps,
  Customer,
} from '@/domain/order/enterprise/entities/customer'
import { faker } from '@faker-js/faker'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
): Customer {
  const customer = Customer.create(
    {
      name: faker.person.firstName(),
      ...override,
    },
    id,
  )

  return customer
}
