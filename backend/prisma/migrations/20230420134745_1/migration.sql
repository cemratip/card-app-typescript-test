-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "scheduled_at" DATETIME NOT NULL
);
