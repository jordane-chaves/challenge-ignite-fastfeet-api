import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchDeliverymanOrdersUseCase } from './fetch-deliveryman-orders'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: FetchDeliverymanOrdersUseCase

describe('Fetch Deliveryman Orders', () => {
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

    sut = new FetchDeliverymanOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch deliveryman orders', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
    )

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(3)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated deliveryman orders', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryOrdersRepository.items.push(
        makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
      )
    }

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 2,
      perPage: 20,
    })

    expect(result.value?.orders).toHaveLength(2)
  })

  it('should not be able to fetch another deliveryman orders', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-1') }),
    )

    const result = await sut.execute({
      deliverymanId: 'deliveryman-2',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(0)
  })
})
