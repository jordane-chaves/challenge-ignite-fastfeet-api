import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
): Notification {
  return Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.words(),
      content: faker.lorem.paragraphs(),
      ...override,
    },
    id,
  )
}
