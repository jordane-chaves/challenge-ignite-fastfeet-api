import { Either, right } from '@/core/either'

import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateDeliverymanUseCaseResponse = Either<
  null,
  {
    deliveryman: Deliveryman
  }
>

export class CreateDeliverymanUseCase {
  constructor(
    private deliverymenRepository: DeliverymenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateDeliverymanUseCaseRequest,
  ): Promise<CreateDeliverymanUseCaseResponse> {
    const { name, cpf, password } = request

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    await this.deliverymenRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
