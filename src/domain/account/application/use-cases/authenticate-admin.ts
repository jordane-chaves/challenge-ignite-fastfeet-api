import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AdminsRepository } from '../repositories/admins-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateAdminUseCaseRequest,
  ): Promise<AuthenticateAdminUseCaseResponse> {
    const { cpf, password } = request

    const admin = await this.adminsRepository.findByCpf(cpf)

    if (!admin) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      role: 'admin',
    })

    return right({
      accessToken,
    })
  }
}
