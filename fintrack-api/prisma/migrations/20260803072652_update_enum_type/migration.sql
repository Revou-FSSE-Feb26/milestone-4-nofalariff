/*
  Warnings:

  - The values [Cash,Bank,EWallet] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Income,Expense,Transfer] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('income', 'expense');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('cash', 'bank', 'ewallet');
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "public"."AccountType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense', 'transfer');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type",
ADD COLUMN     "type" "CategoryType" NOT NULL;
