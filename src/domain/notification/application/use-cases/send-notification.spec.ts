import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      title: 'Order status changed',
      content: 'Your order has been delivered.',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: inMemoryNotificationsRepository.items[0],
    })
  })
})
