/*
  Warnings:

  - You are about to drop the `Block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Block";

-- DropEnum
DROP TYPE "BlockType";
