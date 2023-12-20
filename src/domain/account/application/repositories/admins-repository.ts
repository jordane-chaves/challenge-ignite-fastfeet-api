import { Admin } from '../../enterprise/entities/admin'

export interface AdminsRepository {
  findByCpf(cpf: string): Promise<Admin | null>
}
