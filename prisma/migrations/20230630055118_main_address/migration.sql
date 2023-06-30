/*
  Warnings:

  - You are about to drop the column `mainAddress` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_mainAddress_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "mainAddressFor" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mainAddress";
