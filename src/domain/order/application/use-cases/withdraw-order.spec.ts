import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { OrderNotPostedError } from './errors/order-not-posted-error'
import { WithdrawOrderUseCase } from './withdraw-order'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: WithdrawOrderUseCase

describe('Withdraw Order', () => {
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

    sut = new WithdrawOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to withdraw an order', async () => {
    const newOrder = makeOrder(
      {
        postedAt: new Date(),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
        withdrawnAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to withdraw a not posted order', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))
    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: 'order-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotPostedError)
  })
})
