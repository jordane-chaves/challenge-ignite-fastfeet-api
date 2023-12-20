import { CPF } from './cpf'

describe('CPF', () => {
  it('should be able to create a cpf', () => {
    const cpf = CPF.create('123.123.123-01')

    expect(cpf).toBeTruthy()
    expect(cpf.value).toEqual('123.123.123-01')
  })

  it('should not be able to create a cpf with invalid format', () => {
    expect(() => CPF.create('123')).toThrowError()
  })
})
