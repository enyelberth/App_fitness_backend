/*
  Warnings:

  - You are about to alter the column `typeId` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `AccountType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `AccountType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_typeId_fkey`;

-- AlterTable
ALTER TABLE `Account` MODIFY `typeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `AccountType` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `AccountType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
