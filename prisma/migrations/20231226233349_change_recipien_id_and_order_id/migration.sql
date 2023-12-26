/*
  Warnings:

  - You are about to drop the column `recipientId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipient_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipient_id` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_orderId_fkey";

-- DropIndex
DROP INDEX "addresses_recipientId_key";

-- DropIndex
DROP INDEX "images_orderId_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "recipientId",
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "images" DROP COLUMN "orderId",
ADD COLUMN     "order_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_recipient_id_key" ON "addresses"("recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_order_id_key" ON "images"("order_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
