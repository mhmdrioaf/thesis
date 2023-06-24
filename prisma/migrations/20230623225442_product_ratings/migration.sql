/*
  Warnings:

  - A unique constraint covering the columns `[email,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "commentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentatorId" TEXT NOT NULL,
    "commentValue" TEXT NOT NULL,
    "commentedProductId" INTEGER NOT NULL,
    "ratingValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_username_key" ON "User"("email", "username");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_commentatorId_fkey" FOREIGN KEY ("commentatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_commentedProductId_fkey" FOREIGN KEY ("commentedProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
