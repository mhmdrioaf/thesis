/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[mainAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `receiverId` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "receiverPhone" SET DATA TYPE BIGINT,
ALTER COLUMN "receiverId" SET NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Address_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mainAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mainAddress_key" ON "User"("mainAddress");
