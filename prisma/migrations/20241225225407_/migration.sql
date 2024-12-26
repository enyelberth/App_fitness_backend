/*
  Warnings:

  - You are about to drop the column `ProductId` on the `CategoryProduct` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `SubCategoryProduct` table. All the data in the column will be lost.
  - Added the required column `categoryProductId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryProductId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CategoryProduct` DROP FOREIGN KEY `CategoryProduct_ProductId_fkey`;

-- DropForeignKey
ALTER TABLE `SubCategoryProduct` DROP FOREIGN KEY `SubCategoryProduct_productId_fkey`;

-- AlterTable
ALTER TABLE `CategoryProduct` DROP COLUMN `ProductId`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `categoryProductId` INTEGER NOT NULL,
    ADD COLUMN `subCategoryProductId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `SubCategoryProduct` DROP COLUMN `productId`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryProductId_fkey` FOREIGN KEY (`categoryProductId`) REFERENCES `CategoryProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subCategoryProductId_fkey` FOREIGN KEY (`subCategoryProductId`) REFERENCES `SubCategoryProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
