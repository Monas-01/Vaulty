-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyMonths" INTEGER NOT NULL,
    "store" TEXT,
    "notes" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");
