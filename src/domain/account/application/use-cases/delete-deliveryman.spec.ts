import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteDeliverymanUseCase } from './delete-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository

let sut: DeleteDeliverymanUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()

    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymenRepository)
  })

  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymenRepository.items).toHaveLength(0)
  })
})
