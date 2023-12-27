export interface SearchParams {
  cep: string
}

export abstract class Location {
  abstract search(
    data: SearchParams,
  ): Promise<{ latitude: number; longitude: number }>
}
