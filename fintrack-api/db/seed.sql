

-- ---------- USERS (3) ----------
INSERT INTO users (id, name, email, password) VALUES
  (1, 'Budi Santoso', 'budi@example.com',  'password123'),
  (2, 'Siti Aminah',  'siti@example.com',  'password123'),
  (3, 'Andi Wijaya',  'andi@example.com',  'password123');

-- ---------- CATEGORIES (6, campuran income/expense) ----------
-- "Entertainment" sengaja tidak dipakai transaksi apapun
-- -> dipakai untuk menguji query LEFT JOIN kategori kosong.
INSERT INTO categories (id, name, type) VALUES
  (1, 'Salary',        'income'),
  (2, 'Freelance',      'income'),
  (3, 'Food',           'expense'),
  (4, 'Transport',      'expense'),
  (5, 'Shopping',       'expense'),
  (6, 'Entertainment',  'expense');

-- ---------- ACCOUNTS (2 per user = 6) ----------
-- balance sudah dihitung dari total efek seluruh transaksi di bawah
INSERT INTO accounts (id, user_id, name, type, balance) VALUES
  (1, 1, 'BCA Utama',     'bank',     9075000.00),
  (2, 1, 'Dompet Tunai',  'cash',     -280000.00),
  (3, 2, 'Mandiri Utama', 'bank',     7020000.00),
  (4, 2, 'GoPay',         'e-wallet',  530000.00),
  (5, 3, 'BNI Utama',     'bank',     9500000.00),
  (6, 3, 'Dompet Tunai',  'cash',     -265000.00);

-- ---------- TRANSACTIONS (24, tersebar Mei & Juni 2026) ----------
INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date) VALUES
  -- Budi (account 1 = BCA / bank, account 2 = Dompet Tunai / cash)
  (1, 1, 'income',  8000000.00, 'Gaji bulan Mei',      '2026-05-01'),
  (1, 3, 'expense',  150000.00, 'Makan siang tim',     '2026-05-03'),
  (1, 4, 'expense',  100000.00, 'Bensin',              '2026-05-10'),
  (2, 3, 'expense',   50000.00, 'Warung makan',        '2026-05-04'),
  (2, 5, 'expense',  200000.00, 'Beli baju',           '2026-05-15'),
  (1, 2, 'income',  1500000.00, 'Proyek desain',       '2026-06-02'),
  (1, 3, 'expense',  175000.00, 'Makan malam',         '2026-06-05'),
  (2, 4, 'expense',   30000.00, 'Ojek online',         '2026-06-08'),

  -- Siti (account 3 = Mandiri / bank, account 4 = GoPay / e-wallet)
  (3, 1, 'income',  7500000.00, 'Gaji bulan Mei',      '2026-05-01'),
  (3, 5, 'expense',  300000.00, 'Belanja bulanan',     '2026-05-12'),
  (4, 3, 'expense',   80000.00, 'Kopi & snack',        '2026-05-06'),
  (4, 4, 'expense',   40000.00, 'Ojek online',         '2026-05-20'),
  (3, 3, 'expense',  120000.00, 'Makan siang',         '2026-06-03'),
  (4, 2, 'income',   900000.00, 'Jual barang bekas',   '2026-06-10'),
  (3, 4, 'expense',   60000.00, 'Bensin',              '2026-06-15'),
  (4, 5, 'expense',  250000.00, 'Belanja online',      '2026-06-18'),

  -- Andi (account 5 = BNI / bank, account 6 = Dompet Tunai / cash)
  (5, 1, 'income',  9000000.00, 'Gaji bulan Mei',      '2026-05-01'),
  (5, 3, 'expense',  200000.00, 'Makan bersama keluarga', '2026-05-07'),
  (6, 4, 'expense',   70000.00, 'Parkir & bensin',     '2026-05-11'),
  (6, 5, 'expense',  150000.00, 'Beli sepatu',         '2026-05-25'),
  (5, 3, 'expense',  180000.00, 'Makan malam',         '2026-06-04'),
  (5, 2, 'income',  1200000.00, 'Konsultasi',          '2026-06-12'),
  (6, 4, 'expense',   45000.00, 'Ojek online',         '2026-06-20'),
  (5, 5, 'expense',  320000.00, 'Belanja gadget',      '2026-06-25');

-- Sinkronkan sequence SERIAL supaya insert berikutnya (lewat aplikasi)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('accounts_id_seq', (SELECT MAX(id) FROM accounts));
SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));
