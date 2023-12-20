import { makeCustomer } from 'test/factories/make-customer'
import { makeCustomerAddress } from 'test/factories/make-customer-address'
import { makeImage } from 'test/factories/make-image'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderImage } from 'test/factories/make-order-image'
import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { GetOrderUseCase } from './get-order'

let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: GetOrderUseCase

describe('Get Order', () => {
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

    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get a order', async () => {
    const customer = makeCustomer({ name: 'John Doe' })
    inMemoryCustomersRepository.items.push(customer)

    const customerAddress = makeCustomerAddress({
      customerId: customer.id,
      cep: '12345-000',
    })

    inMemoryCustomerAddressesRepository.items.push(customerAddress)

    const newOrder = makeOrder(
      {
        customerId: customer.id,
        description: 'Package 01',
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const image = makeImage({
      title: 'Some image',
    })

    inMemoryImagesRepository.items.push(image)

    inMemoryOrderImagesRepository.items.push(
      makeOrderImage({
        imageId: image.id,
        orderId: newOrder.id,
      }),
    )

    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        description: newOrder.description,
        image: image.url,
        customer: 'John Doe',
        cep: '12345-000',
      }),
    })
  })
})
