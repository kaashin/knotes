-- AlterTable
ALTER TABLE "notion_tokens" ADD COLUMN     "tokenType" TEXT,
ALTER COLUMN "workspaceName" DROP NOT NULL,
ALTER COLUMN "workspaceIcon" DROP NOT NULL,
ALTER COLUMN "botId" DROP NOT NULL;
