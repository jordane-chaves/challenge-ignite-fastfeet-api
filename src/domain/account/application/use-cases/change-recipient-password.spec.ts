import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ChangeRecipientPasswordUseCase } from './change-recipient-password'

let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher

let sut: ChangeRecipientPasswordUseCase

describe('Change Recipient Password', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )
    fakeHasher = new FakeHasher()

    sut = new ChangeRecipientPasswordUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
    )
  })

  it('should be able to change recipient password', async () => {
    const recipient = makeRecipient(
      { password: await fakeHasher.hash('123456') },
      new UniqueEntityID('recipient-1'),
    )
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-1',
      newPassword: '123123',
    })

    const hashedNewPassword = await fakeHasher.hash('123123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      hashedNewPassword,
    )
  })
})
