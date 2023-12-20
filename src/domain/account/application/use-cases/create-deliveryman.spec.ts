import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { CreateDeliverymanUseCase } from './create-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository
let fakeHasher: FakeHasher

let sut: CreateDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymenRepository,
      fakeHasher,
    )
  })

  it('should be able to create a new deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-01',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymenRepository.items[0],
    })
  })

  it('should hashed deliveryman password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-01',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymenRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
