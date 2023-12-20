export interface SearchParams {
  cep: string
}

export interface Location {
  search(data: SearchParams): Promise<{ latitude: number; longitude: number }>
}
