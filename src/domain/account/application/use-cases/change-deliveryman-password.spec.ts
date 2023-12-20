import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ChangeDeliverymanPasswordUseCase } from './change-deliveryman-password'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository
let fakeHasher: FakeHasher

let sut: ChangeDeliverymanPasswordUseCase

describe('Change Deliveryman Password', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangeDeliverymanPasswordUseCase(
      inMemoryDeliverymenRepository,
      fakeHasher,
    )
  })

  it('should be able to change deliveryman password', async () => {
    const deliveryman = makeDeliveryman(
      { password: await fakeHasher.hash('123456') },
      new UniqueEntityID('deliveryman-1'),
    )
    inMemoryDeliverymenRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      newPassword: '123123',
    })

    const hashedNewPassword = await fakeHasher.hash('123123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymenRepository.items[0].password).toEqual(
      hashedNewPassword,
    )
  })
})
