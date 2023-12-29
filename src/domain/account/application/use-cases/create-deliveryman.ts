import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateDeliverymanUseCaseResponse = Either<
  AccountAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymenRepository: DeliverymenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateDeliverymanUseCaseRequest,
  ): Promise<CreateDeliverymanUseCaseResponse> {
    const { name, cpf, password } = request

    const deliverymanWithSameCpf =
      await this.deliverymenRepository.findByCpf(cpf)

    if (deliverymanWithSameCpf) {
      return left(new AccountAlreadyExistsError(cpf))
    }

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
