import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateDeliverymanUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliverymanUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymenRepository: DeliverymenRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateDeliverymanUseCaseRequest,
  ): Promise<AuthenticateDeliverymanUseCaseResponse> {
    const { cpf, password } = request

    const deliveryman = await this.deliverymenRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
