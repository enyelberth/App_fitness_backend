/*
  Warnings:

  - You are about to drop the column `typeId` on the `AccountAdmin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccountAdmin` DROP FOREIGN KEY `AccountAdmin_currencyId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountAdmin` DROP FOREIGN KEY `AccountAdmin_typeId_fkey`;

-- AlterTable
ALTER TABLE `AccountAdmin` DROP COLUMN `typeId`;
