-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "completedExchanges" INTEGER,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;
