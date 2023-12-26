import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { Admin } from '@/domain/account/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.cpf.value === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }
}
