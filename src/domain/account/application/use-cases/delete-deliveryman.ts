import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string
}

type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDeliverymanUseCase {
  constructor(private deliverymenRepository: DeliverymenRepository) {}

  async execute(
    request: DeleteDeliverymanUseCaseRequest,
  ): Promise<DeleteDeliverymanUseCaseResponse> {
    const { deliverymanId } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymenRepository.delete(deliveryman)

    return right(null)
  }
}
