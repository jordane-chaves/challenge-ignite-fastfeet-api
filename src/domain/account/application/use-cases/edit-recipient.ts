import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Recipient } from '../../enterprise/entities/recipient'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Location } from '../services/location'

interface EditRecipientUseCaseRequest {
  recipientId: string
  cpf: string
  name: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

export class EditRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private location: Location,
  ) {}

  async execute(
    request: EditRecipientUseCaseRequest,
  ): Promise<EditRecipientUseCaseResponse> {
    const { recipientId, name, cpf, street, number, neighborhood, city, cep } =
      request

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const { latitude, longitude } = await this.location.search({ cep })

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
