import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { GetRecipientUseCase } from './get-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository

let sut: GetRecipientUseCase

describe('Get Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    sut = new GetRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get a recipient', async () => {
    const recipient = makeRecipient(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('recipient-1'),
    )
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: expect.objectContaining({
        name: 'John Doe',
      }),
    })
  })
})
