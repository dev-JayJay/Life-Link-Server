/*
  Warnings:

  - You are about to drop the column `message` on the `BloodRequest` table. All the data in the column will be lost.
  - Added the required column `bloodType` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BloodRequest" DROP CONSTRAINT "BloodRequest_userId_fkey";

-- AlterTable
ALTER TABLE "BloodRequest" DROP COLUMN "message",
ADD COLUMN     "bloodType" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "units" INTEGER NOT NULL,
ADD COLUMN     "urgency" TEXT NOT NULL DEFAULT 'Normal',
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
