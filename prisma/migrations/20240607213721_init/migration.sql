/*
  Warnings:

  - You are about to drop the column `accountTypeAdminId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountAdminId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AccountAdmin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_accountTypeAdminId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountAdmin` DROP FOREIGN KEY `AccountAdmin_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_accountAdminId_fkey`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `accountTypeAdminId`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `accountAdminId`;

-- CreateTable
CREATE TABLE `TransactionAdmin` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountAdminId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AccountAdmin_userId_key` ON `AccountAdmin`(`userId`);

-- AddForeignKey
ALTER TABLE `AccountAdmin` ADD CONSTRAINT `AccountAdmin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionAdmin` ADD CONSTRAINT `TransactionAdmin_accountAdminId_fkey` FOREIGN KEY (`accountAdminId`) REFERENCES `AccountAdmin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
