import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/order/enterprise/entities/image'
import { faker } from '@faker-js/faker'

export function makeImage(
  override: Partial<ImageProps>,
  id?: UniqueEntityID,
): Image {
  return Image.create(
    {
      title: faker.lorem.word(),
      url: faker.image.url(),
      ...override,
    },
    id,
  )
}
