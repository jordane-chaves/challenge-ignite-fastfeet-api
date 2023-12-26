import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditOrderUseCase } from './edit-order'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryCustomerAddressesRepository =
      new InMemoryCustomerAddressesRepository()
    inMemoryCustomersRepository = new InMemoryCustomersRepository()
    inMemoryOrderImagesRepository = new InMemoryOrderImagesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderImagesRepository,
      inMemoryImagesRepository,
      inMemoryCustomersRepository,
      inMemoryCustomerAddressesRepository,
    )

    sut = new EditOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to edit an order', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))
    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      customerId: 'customer-1',
      description: 'New package',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        customerId: new UniqueEntityID('customer-1'),
        description: 'New package',
      }),
    )
  })
})
