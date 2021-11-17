/*
  Warnings:

  - Added the required column `userId` to the `notion_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notion_tokens" DROP CONSTRAINT "notion_tokens_accessToken_fkey";

-- AlterTable
ALTER TABLE "notion_tokens" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notion_tokens" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
