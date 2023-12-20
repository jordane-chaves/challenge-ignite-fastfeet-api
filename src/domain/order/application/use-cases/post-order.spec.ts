import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PostOrderUseCase } from './post-order'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: PostOrderUseCase

describe('Post Order', () => {
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

    sut = new PostOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to post an order', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))
    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        postedAt: expect.any(Date),
      }),
    )
  })
})
