import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { AuthenticateRecipientUseCase } from './authenticate-recipient'

let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateRecipientUseCase

describe('Authenticate Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateRecipientUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a recipient', async () => {
    const recipient = makeRecipient({
      cpf: CPF.create('123.123.123-01'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      cpf: '123.123.123-01',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
