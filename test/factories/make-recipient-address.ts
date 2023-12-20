import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  RecipientAddressProps,
  RecipientAddress,
} from '@/domain/account/enterprise/entities/value-objects/recipient-address'
import { faker } from '@faker-js/faker'

export function makeRecipientAddress(
  override: Partial<RecipientAddressProps> = {},
): RecipientAddress {
  const recipientAddress = RecipientAddress.create({
    recipientId: new UniqueEntityID(),
    city: faker.location.city(),
    neighborhood: faker.location.county(),
    street: faker.location.street(),
    cep: faker.number.int().toString(),
    number: faker.number.int(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override,
  })

  return recipientAddress
}
