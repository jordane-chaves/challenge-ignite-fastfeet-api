import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateRecipientUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateRecipientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateRecipientUseCaseRequest,
  ): Promise<AuthenticateRecipientUseCaseResponse> {
    const { cpf, password } = request

    const recipient = await this.recipientsRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      recipient.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
