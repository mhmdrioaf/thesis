/*
  Warnings:

  - You are about to drop the column `mainAddressFor` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `receiverPhone` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username,email]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,email]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverPhoneNumber` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ONHOLD', 'PAID', 'PACKED', 'SHIPPED', 'CLOSED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_commentatorId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_commentedProductId_fkey";

-- DropIndex
DROP INDEX "Customer_email_username_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "mainAddressFor",
DROP COLUMN "note",
DROP COLUMN "receiverId",
DROP COLUMN "receiverPhone",
ADD COLUMN     "primaryAddressFor" TEXT,
ADD COLUMN     "receiverPhoneNumber" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Administrator" DROP COLUMN "dateOfBirth",
DROP COLUMN "image",
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "image",
ADD COLUMN     "imageURL" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
ADD COLUMN     "descriptions" TEXT,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "stock" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "address",
DROP COLUMN "dateOfBirth",
DROP COLUMN "image",
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "phoneNumber" BIGINT,
ADD COLUMN     "storeAddress" TEXT;

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "CustomerOrder" (
    "id" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "customerID" TEXT NOT NULL,
    "dateOfOrder" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "CustomerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderItemID" TEXT NOT NULL,
    "productID" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderID" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemID")
);

-- CreateTable
CREATE TABLE "SellerOrder" (
    "id" TEXT NOT NULL,
    "dateOfOrder" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerID" TEXT NOT NULL,
    "customerID" TEXT NOT NULL,
    "customerOrderID" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SellerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOrder_customerID_key" ON "CustomerOrder"("customerID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_productID_key" ON "OrderItem"("productID");

-- CreateIndex
CREATE UNIQUE INDEX "SellerOrder_customerID_key" ON "SellerOrder"("customerID");

-- CreateIndex
CREATE UNIQUE INDEX "SellerOrder_customerOrderID_key" ON "SellerOrder"("customerOrderID");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_username_email_key" ON "Administrator"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_username_email_key" ON "Customer"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_username_email_key" ON "Seller"("username", "email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_primaryAddressFor_fkey" FOREIGN KEY ("primaryAddressFor") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerOrder" ADD CONSTRAINT "SellerOrder_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerOrder" ADD CONSTRAINT "SellerOrder_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerOrder" ADD CONSTRAINT "SellerOrder_customerOrderID_fkey" FOREIGN KEY ("customerOrderID") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
