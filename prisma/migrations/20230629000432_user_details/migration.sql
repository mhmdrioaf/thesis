-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" INTEGER;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    "fullAddress" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" INTEGER NOT NULL,
    "receiverId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
