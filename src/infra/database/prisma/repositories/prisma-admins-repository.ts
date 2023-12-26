import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { Admin } from '@/domain/account/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'

import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }
}
