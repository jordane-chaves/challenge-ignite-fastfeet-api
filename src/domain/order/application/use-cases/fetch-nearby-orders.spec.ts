import { makeCustomer } from 'test/factories/make-customer'
import { makeCustomerAddress } from 'test/factories/make-customer-address'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {
  beforeEach(() => {
    inMemoryCustomerAddressesRepository =
      new InMemoryCustomerAddressesRepository()
    inMemoryCustomersRepository = new InMemoryCustomersRepository()

    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryOrderImagesRepository = new InMemoryOrderImagesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderImagesRepository,
      inMemoryImagesRepository,
      inMemoryCustomersRepository,
      inMemoryCustomerAddressesRepository,
    )

    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch nearby orders', async () => {
    const customer1 = makeCustomer()
    const customer2 = makeCustomer()

    inMemoryCustomerAddressesRepository.items.push(
      makeCustomerAddress({
        customerId: customer1.id,
        latitude: -20.4446516,
        longitude: -44.7663455,
      }),

      makeCustomerAddress({
        customerId: customer2.id,
        latitude: -20.437451,
        longitude: -44.778517,
      }),
    )

    inMemoryCustomersRepository.items.push(customer1, customer2)

    inMemoryOrdersRepository.items.push(
      makeOrder({ customerId: customer1.id, description: 'Near order' }),
      makeOrder({ customerId: customer2.id, description: 'Far order' }),
    )

    const result = await sut.execute({
      deliverymanLatitude: -20.4441629,
      deliverymanLongitude: -44.7664973,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(1)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({
          description: 'Near order',
        }),
      ],
    })
  })
})
