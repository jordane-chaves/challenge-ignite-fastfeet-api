import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { AuthenticateDeliverymanUseCase } from './authenticate-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateDeliverymanUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymenRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: CPF.create('123.123.123-01'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryDeliverymenRepository.items.push(deliveryman)

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
