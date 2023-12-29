import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchNotificationsUseCase } from './fetch-notifications'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: FetchNotificationsUseCase

describe('Fetch Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new FetchNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to fetch notifications', async () => {
    inMemoryNotificationsRepository.items.push(
      makeNotification({ recipientId: new UniqueEntityID('recipient-1') }),
      makeNotification({ recipientId: new UniqueEntityID('recipient-1') }),
      makeNotification({ recipientId: new UniqueEntityID('recipient-1') }),
    )

    const result = await sut.execute({
      recipientId: 'recipient-1',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notifications: [
        expect.objectContaining({
          recipientId: new UniqueEntityID('recipient-1'),
        }),
        expect.objectContaining({
          recipientId: new UniqueEntityID('recipient-1'),
        }),
        expect.objectContaining({
          recipientId: new UniqueEntityID('recipient-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated notifications', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryNotificationsRepository.items.push(
        makeNotification({ recipientId: new UniqueEntityID('recipient-1') }),
      )
    }

    const result = await sut.execute({
      recipientId: 'recipient-1',
      page: 2,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notifications).toHaveLength(2)
  })
})
