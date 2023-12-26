-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'DELIVERYMAN', 'RECIPIENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL DEFAULT 'RECIPIENT',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "deliveryman_id" TEXT,
    "description" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3),
    "withdrawn_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
