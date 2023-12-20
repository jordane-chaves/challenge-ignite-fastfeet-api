import { makeRecipient } from 'test/factories/make-recipient'
import { makeRecipientAddress } from 'test/factories/make-recipient-address'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FakeLocation } from 'test/services/fake-location'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'
import { EditRecipientUseCase } from './edit-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let fakeLocation: FakeLocation

let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    fakeLocation = new FakeLocation()

    sut = new EditRecipientUseCase(inMemoryRecipientsRepository, fakeLocation)
  })

  it('should be able to edit a recipient', async () => {
    const recipient = makeRecipient(
      {
        name: 'John Doe',
        cpf: CPF.create('123.123.123-01'),
      },
      new UniqueEntityID('recipient-1'),
    )

    inMemoryRecipientsRepository.items.push(recipient)

    const address = makeRecipientAddress({
      recipientId: recipient.id,
      cep: '12345-000',
      street: 'Center street',
      number: 1,
      neighborhood: 'Center',
      city: 'City 01',
    })

    inMemoryRecipientAddressesRepository.items.push(address)

    const result = await sut.execute({
      recipientId: 'recipient-1',
      name: 'John Doe',
      cpf: '123.123.123-02',
      cep: '54321-000',
      street: 'Center street',
      number: 5,
      neighborhood: 'Center',
      city: 'City 02',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        cpf: CPF.create('123.123.123-02'),
      }),
    )
    expect(inMemoryRecipientsRepository.items[0].address).toEqual(
      RecipientAddress.create({
        recipientId: new UniqueEntityID('recipient-1'),
        cep: '54321-000',
        street: 'Center street',
        number: 5,
        neighborhood: 'Center',
        city: 'City 02',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    )
  })

  it('should sync address when editing a recipient', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-1'))

    inMemoryRecipientsRepository.items.push(recipient)

    const address = makeRecipientAddress({
      recipientId: recipient.id,
      cep: '12345-000',
      street: 'Center street',
      number: 1,
      neighborhood: 'Center',
      city: 'City 01',
    })

    inMemoryRecipientAddressesRepository.items.push(address)

    await sut.execute({
      recipientId: 'recipient-1',
      name: 'John Doe',
      cpf: '123.123.123-02',
      cep: '54321-000',
      street: 'Center street',
      number: 5,
      neighborhood: 'Center',
      city: 'City 02',
    })

    expect(inMemoryRecipientAddressesRepository.items[0]).toEqual(
      RecipientAddress.create({
        recipientId: new UniqueEntityID('recipient-1'),
        cep: '54321-000',
        street: 'Center street',
        number: 5,
        neighborhood: 'Center',
        city: 'City 02',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    )
  })
})
