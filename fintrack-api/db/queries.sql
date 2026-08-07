-- 1. FILTERED SELECT
-- Semua transaksi expense di akun #1, diurutkan dari yang terbaru.
SELECT id, type, amount, description, transaction_date
FROM transactions
WHERE account_id = 1
  AND type = 'expense'
ORDER BY transaction_date DESC;


-- 2. JOIN 3+ TABEL
-- Menampilkan nama user, nama akun, nama kategori, dan jumlah
-- untuk setiap transaksi (join transactions + accounts + categories + users).
SELECT
  u.name        AS user_name,
  a.name        AS account_name,
  c.name        AS category_name,
  t.amount,
  t.type,
  t.transaction_date
FROM transactions t
JOIN accounts a    ON t.account_id = a.id
JOIN categories c  ON t.category_id = c.id
JOIN users u       ON a.user_id = u.id
ORDER BY t.transaction_date DESC;


-- 3. GROUP BY AGGREGATION
-- Total pengeluaran (expense) per kategori per bulan.
SELECT
  c.name AS category_name,
  DATE_TRUNC('month', t.transaction_date) AS month,
  SUM(t.amount) AS total_expense
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name, DATE_TRUNC('month', t.transaction_date)
ORDER BY month, total_expense DESC;


-- 4. ADVANCED — SUBQUERY
-- Akun-akun yang saldonya di bawah rata-rata saldo milik user yang sama.
SELECT a.id, a.name, a.balance, a.user_id
FROM accounts a
WHERE a.balance < (
  SELECT AVG(a2.balance)
  FROM accounts a2
  WHERE a2.user_id = a.user_id
);


-- 5. ADVANCED — WINDOW FUNCTION
-- Kategori dengan pengeluaran terbesar (top spending category) per user.
WITH spending_per_user_category AS (
  SELECT
    u.id AS user_id,
    u.name AS user_name,
    c.name AS category_name,
    SUM(t.amount) AS total_spent,
    RANK() OVER (
      PARTITION BY u.id
      ORDER BY SUM(t.amount) DESC
    ) AS spending_rank
  FROM transactions t
  JOIN accounts a   ON t.account_id = a.id
  JOIN users u      ON a.user_id = u.id
  JOIN categories c ON t.category_id = c.id
  WHERE t.type = 'expense'
  GROUP BY u.id, u.name, c.name
)
SELECT user_name, category_name, total_spent
FROM spending_per_user_category
WHERE spending_rank = 1;


-- 6. LEFT JOIN
-- Kategori yang belum pernah dipakai di transaksi manapun.
SELECT c.id, c.name, c.type
FROM categories c
LEFT JOIN transactions t ON t.category_id = c.id
WHERE t.id IS NULL;


-- 7. AGGREGATION TAMBAHAN
-- Total income vs total expense per user (ringkasan keuangan per user).
SELECT
  u.name AS user_name,
  SUM(CASE WHEN t.type = 'income'  THEN t.amount ELSE 0 END) AS total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u    ON a.user_id = u.id
GROUP BY u.name
ORDER BY u.name;


-- 8. ADVANCED — WINDOW FUNCTION (ROW_NUMBER)
-- Transaksi dengan nominal terbesar di masing-masing akun.
SELECT account_id, id, description, amount, transaction_date
FROM (
  SELECT
    account_id, id, description, amount, transaction_date,
    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC) AS rn
  FROM transactions
  WHERE type = 'expense'
) ranked
WHERE rn = 1;
