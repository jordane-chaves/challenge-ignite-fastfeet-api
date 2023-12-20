import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { CreateOrderUseCase } from './create-order'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: CreateOrderUseCase

describe('Create Order', () => {
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

    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryCustomersRepository,
    )
  })

  it('should be able to create a new order', async () => {
    const customer = makeCustomer()
    inMemoryCustomersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
      description: 'Package 01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    })
  })
})
