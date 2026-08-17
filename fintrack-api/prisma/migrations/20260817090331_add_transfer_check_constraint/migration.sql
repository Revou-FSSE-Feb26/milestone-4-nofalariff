-- CHECK constraint: to_account_id wajib diisi kalau type = 'transfer',
-- dan wajib NULL untuk income/expense (menjaga integritas data level DB,
-- bukan cuma validasi di application layer)
ALTER TABLE "Transaction"
ADD CONSTRAINT "transfer_requires_to_account_id"
CHECK (
  (type = 'transfer' AND "to_account_id" IS NOT NULL)
  OR (type <> 'transfer' AND "to_account_id" IS NULL)
);