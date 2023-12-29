import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Recipient } from '../../enterprise/entities/recipient'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'
import { HashGenerator } from '../cryptography/hash-generator'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Location } from '../services/location'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'

interface CreateRecipientUseCaseRequest {
  name: string
  cpf: string
  password: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
}

type CreateRecipientUseCaseResponse = Either<
  AccountAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
    private location: Location,
  ) {}

  async execute(
    request: CreateRecipientUseCaseRequest,
  ): Promise<CreateRecipientUseCaseResponse> {
    const { name, cpf, password, cep, city, neighborhood, number, street } =
      request

    const recipientWithSameCpf = await this.recipientsRepository.findByCpf(cpf)

    if (recipientWithSameCpf) {
      return left(new AccountAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const recipient = Recipient.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    const { latitude, longitude } = await this.location.search({ cep })

    const address = RecipientAddress.create({
      recipientId: recipient.id,
      cep,
      city,
      neighborhood,
      number,
      street,
      latitude,
      longitude,
    })

    recipient.address = address

    await this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
