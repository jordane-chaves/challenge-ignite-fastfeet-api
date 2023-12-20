import { makeOrder } from 'test/factories/make-order'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeliverOrderUseCase } from './deliver-order'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: DeliverOrderUseCase

describe('Deliver Order', () => {
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

    sut = new DeliverOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to deliver an order', async () => {
    const newOrder = makeOrder(
      {
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      imageId: 'image-1',
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        image: expect.objectContaining({
          imageId: new UniqueEntityID('image-1'),
        }),
        deliveredAt: expect.any(Date),
      }),
    )
  })

  it('should persist image when deliver an order', async () => {
    const newOrder = makeOrder(
      {
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      imageId: 'image-1',
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderImagesRepository.items).toHaveLength(1)
    expect(inMemoryOrderImagesRepository.items).toEqual([
      expect.objectContaining({
        imageId: new UniqueEntityID('image-1'),
        orderId: new UniqueEntityID('order-1'),
      }),
    ])
  })

  it('should not be able to deliver another deliveryman order', async () => {
    const newOrder = makeOrder(
      {
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-2',
      imageId: 'image-1',
      orderId: 'order-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
