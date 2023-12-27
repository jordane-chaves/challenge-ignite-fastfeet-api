import { hash } from 'bcryptjs'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      name: 'John Doe',
      cpf: '123.123.123-00',
      password: await hash('123456', 8),
      role: 'ADMIN',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
