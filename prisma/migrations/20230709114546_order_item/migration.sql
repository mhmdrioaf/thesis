/*
  Warnings:

  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productID` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderID_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "totalPrice" INTEGER NOT NULL,
DROP COLUMN "productID",
ADD COLUMN     "productID" INTEGER NOT NULL,
ALTER COLUMN "orderID" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_productID_key" ON "OrderItem"("productID");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "CustomerOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
