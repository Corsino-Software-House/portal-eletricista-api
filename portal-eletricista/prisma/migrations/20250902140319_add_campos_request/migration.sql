/*
  Warnings:

  - You are about to alter the column `status` on the `request` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `tempo` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `request` ADD COLUMN `tempo` ENUM('NORMAL', 'URGENTE', 'PIQUETE', 'AVARIA') NOT NULL,
    MODIFY `status` ENUM('ESPERA', 'ABERTO', 'CONCLUIDO') NOT NULL;
