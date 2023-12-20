import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { CPF } from './value-objects/cpf'
import { RecipientAddress } from './value-objects/recipient-address'

export interface RecipientProps {
  name: string
  cpf: CPF
  password: string
  address?: RecipientAddress | null
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get address() {
    return this.props.address
  }

  set address(address: RecipientAddress | null | undefined) {
    this.props.address = address
  }

  static create(
    props: Optional<RecipientProps, 'address'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        address: null,
      },
      id,
    )

    return recipient
  }
}
