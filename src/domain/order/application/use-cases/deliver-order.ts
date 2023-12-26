import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Order } from '../../enterprise/entities/order'
import { OrderImage } from '../../enterprise/entities/order-image'
import { OrdersRepository } from '../repositories/orders-repository'
import { RequiredImageError } from './errors/required-image-error'

interface DeliverOrderUseCaseRequest {
  deliverymanId: string
  imageId: string
  orderId: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: DeliverOrderUseCaseRequest,
  ): Promise<DeliverOrderUseCaseResponse> {
    const { deliverymanId, imageId, orderId } = request

    if (!imageId) {
      return left(new RequiredImageError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId?.toString()) {
      return left(new NotAllowedError())
    }

    const orderImage = OrderImage.create({
      imageId: new UniqueEntityID(imageId),
      orderId: new UniqueEntityID(orderId),
    })

    order.image = orderImage
    order.deliver()

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
