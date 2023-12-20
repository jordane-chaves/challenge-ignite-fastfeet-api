import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'
import { SamePasswordError } from './errors/same-password-error'

interface ChangeDeliverymanPasswordUseCaseRequest {
  deliverymanId: string
  newPassword: string
}

type ChangeDeliverymanPasswordUseCaseResponse = Either<
  ResourceNotFoundError | SamePasswordError,
  null
>

export class ChangeDeliverymanPasswordUseCase {
  constructor(
    private deliverymenRepository: DeliverymenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: ChangeDeliverymanPasswordUseCaseRequest,
  ): Promise<ChangeDeliverymanPasswordUseCaseResponse> {
    const { deliverymanId, newPassword } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const isSamePassword = deliveryman.password === newPassword

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword)

    deliveryman.password = hashedNewPassword

    await this.deliverymenRepository.save(deliveryman)

    return right(null)
  }
}
