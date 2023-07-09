/*
  Warnings:

  - You are about to drop the column `customerID` on the `SellerOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SellerOrder" DROP CONSTRAINT "SellerOrder_customerID_fkey";

-- DropIndex
DROP INDEX "SellerOrder_customerID_key";

-- AlterTable
ALTER TABLE "CustomerOrder" ADD COLUMN     "va" TEXT;

-- AlterTable
ALTER TABLE "SellerOrder" DROP COLUMN "customerID",
ADD COLUMN     "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "SellerOrder" ADD CONSTRAINT "SellerOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
