import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchCustomerOrdersUseCase } from './fetch-customer-orders'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: FetchCustomerOrdersUseCase

describe('Fetch Customer Orders', () => {
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

    sut = new FetchCustomerOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch customer orders', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder({ customerId: new UniqueEntityID('customer-1') }),
      makeOrder({ customerId: new UniqueEntityID('customer-1') }),
      makeOrder({ customerId: new UniqueEntityID('customer-1') }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(3)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated customer orders', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryOrdersRepository.items.push(
        makeOrder({ customerId: new UniqueEntityID('customer-1') }),
      )
    }

    const result = await sut.execute({
      customerId: 'customer-1',
      page: 2,
      perPage: 20,
    })

    expect(result.value?.orders).toHaveLength(2)
  })
})
