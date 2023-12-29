import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { CreateAdminUseCase } from './create-admin'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher

let sut: CreateAdminUseCase

describe('Create Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to create a new admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-00',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0],
    })
  })

  it('should hash admin password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-00',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create an existing admin', async () => {
    inMemoryAdminsRepository.items.push(
      makeAdmin({
        name: 'John Doe',
        cpf: CPF.create('123.123.123-00'),
        password: '123456',
      }),
    )

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-00',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError)
  })
})
