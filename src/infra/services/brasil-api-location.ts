import {
  Location,
  SearchParams,
} from '@/domain/account/application/services/location'

interface FetchByCepResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
  location: {
    type: string
    coordinates: {
      longitude: string
      latitude: string
    }
  }
}

export class BrasilApiLocation implements Location {
  private baseUrl: string = 'https://brasilapi.com.br/api'

  async search({
    cep,
  }: SearchParams): Promise<{ latitude: number; longitude: number }> {
    const path = `/cep/v2/${cep}`

    return fetch(`${this.baseUrl}${path}`)
      .then((response) => response.json())
      .then((data: FetchByCepResponse) => {
        return {
          latitude: Number(data.location?.coordinates?.latitude ?? 0),
          longitude: Number(data.location?.coordinates?.longitude ?? 0),
        }
      })
  }
}
