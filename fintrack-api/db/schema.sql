-- 1. USERS
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'user'
             CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20)  NOT NULL
       CHECK (type IN ('income', 'expense'))
);

-- 3. ACCOUNTS
CREATE TABLE accounts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name       VARCHAR(100) NOT NULL,
  type       VARCHAR(20)  NOT NULL
             CHECK (type IN ('cash', 'bank', 'e-wallet')),
  balance    NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 4. TRANSACTIONS
CREATE TABLE transactions (
  id               SERIAL PRIMARY KEY,
  account_id       INTEGER       NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id      INTEGER       NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type             VARCHAR(20)   NOT NULL
                   CHECK (type IN ('income', 'expense', 'transfer')),
  amount           NUMERIC(12,2) NOT NULL,
  description      TEXT          NOT NULL,
  transaction_date DATE          NOT NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
  -- hanya diisi ketika type = 'transfer'; akun tujuan dana berpindah
  to_account_id    INTEGER       REFERENCES accounts(id) ON DELETE RESTRICT,
  CHECK (
    (type = 'transfer' AND to_account_id IS NOT NULL)
    OR (type <> 'transfer' AND to_account_id IS NULL)
  )
);

-- Index tambahan untuk mempercepat query yang sering dipakai (filter & join)
CREATE INDEX idx_accounts_user_id       ON accounts(user_id);
CREATE INDEX idx_transactions_account   ON transactions(account_id);
CREATE INDEX idx_transactions_category  ON transactions(category_id);
CREATE INDEX idx_transactions_date      ON transactions(transaction_date);
