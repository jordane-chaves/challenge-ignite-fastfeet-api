import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { GetDeliverymanUseCase } from './get-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository

let sut: GetDeliverymanUseCase

describe('Get Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()

    sut = new GetDeliverymanUseCase(inMemoryDeliverymenRepository)
  })

  it('should be able to get a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('deliveryman-1'),
    )
    inMemoryDeliverymenRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: expect.objectContaining({
        name: 'John Doe',
      }),
    })
  })
})
