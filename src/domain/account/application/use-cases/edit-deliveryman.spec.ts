import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymenRepository } from 'test/repositories/in-memory-deliverymen-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { EditDeliverymanUseCase } from './edit-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository

let sut: EditDeliverymanUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()

    sut = new EditDeliverymanUseCase(inMemoryDeliverymenRepository)
  })

  it('should be able to edit a deliveryman', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      name: 'John Doe',
      cpf: '987.654.321-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymenRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        cpf: CPF.create('987.654.321-01'),
      }),
    )
  })
})
