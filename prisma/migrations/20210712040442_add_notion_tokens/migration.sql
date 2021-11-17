-- CreateTable
CREATE TABLE "notion_tokens" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "workspaceName" TEXT NOT NULL,
    "workspaceIcon" TEXT NOT NULL,
    "botId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notion_tokens" ADD FOREIGN KEY ("accessToken") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
