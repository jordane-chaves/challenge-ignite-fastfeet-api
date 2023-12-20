import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CPF } from './value-objects/cpf'

export interface AdminProps {
  name: string
  cpf: CPF
  password: string
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id)

    return admin
  }
}
