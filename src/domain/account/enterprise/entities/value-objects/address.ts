import { ValueObject } from '@/core/entities/value-object'

export interface AddressProps {
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
  latitude: number
  longitude: number
}

export abstract class Address<
  Props extends AddressProps,
> extends ValueObject<Props> {
  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get cep() {
    return this.props.cep
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }
}
