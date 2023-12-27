import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Recipient } from '../../enterprise/entities/recipient'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface EditRecipientUseCaseRequest {
  recipientId: string
  cpf: string
  name: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
  latitude: number
  longitude: number
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(
    request: EditRecipientUseCaseRequest,
  ): Promise<EditRecipientUseCaseResponse> {
    const {
      recipientId,
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    } = request

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const newAddress = RecipientAddress.create({
      recipientId: recipient.id,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    })

    recipient.name = name
    recipient.cpf = CPF.create(cpf)
    recipient.address = newAddress

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
