-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_adminId_fkey`;

-- DropIndex
DROP INDEX `Product_adminId_fkey` ON `Product`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
