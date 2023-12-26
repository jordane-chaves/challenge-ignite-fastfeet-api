-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_orderId_key" ON "images"("orderId");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
