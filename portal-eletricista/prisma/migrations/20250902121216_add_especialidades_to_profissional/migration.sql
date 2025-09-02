/*
  Warnings:

  - You are about to drop the column `especialidade` on the `profissional` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Profissional` DROP COLUMN `especialidade`,
    ADD COLUMN `especialidades` JSON NULL;
