import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface EditDeliverymanUseCaseRequest {
  deliverymanId: string
  name: string
  cpf: string
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

export class EditDeliverymanUseCase {
  constructor(private deliverymenRepository: DeliverymenRepository) {}

  async execute(
    request: EditDeliverymanUseCaseRequest,
  ): Promise<EditDeliverymanUseCaseResponse> {
    const { deliverymanId, name, cpf } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    deliveryman.name = name
    deliveryman.cpf = CPF.create(cpf)

    await this.deliverymenRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
