import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface GetDeliverymanUseCaseRequest {
  deliverymanId: string
}

type GetDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

export class GetDeliverymanUseCase {
  constructor(private deliverymenRepository: DeliverymenRepository) {}

  async execute(
    request: GetDeliverymanUseCaseRequest,
  ): Promise<GetDeliverymanUseCaseResponse> {
    const { deliverymanId } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliveryman,
    })
  }
}
