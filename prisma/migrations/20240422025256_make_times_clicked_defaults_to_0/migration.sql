-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "short_link" TEXT NOT NULL,
    "redirect_link" TEXT NOT NULL,
    "times_clicked" INTEGER NOT NULL DEFAULT 0,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "links_short_link_key" ON "links"("short_link");
