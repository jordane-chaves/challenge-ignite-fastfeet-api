import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomerAddressProps,
  CustomerAddress,
} from '@/domain/order/enterprise/entities/value-objects/customer-address'
import { faker } from '@faker-js/faker'

export function makeCustomerAddress(
  override: Partial<CustomerAddressProps> = {},
): CustomerAddress {
  const customerAddress = CustomerAddress.create({
    customerId: new UniqueEntityID(),
    city: faker.location.city(),
    neighborhood: faker.location.county(),
    street: faker.location.street(),
    cep: faker.number.int().toString(),
    number: faker.number.int(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override,
  })

  return customerAddress
}
