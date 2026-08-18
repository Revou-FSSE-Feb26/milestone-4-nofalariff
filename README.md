# FinTrack API

REST API untuk mencatat dan mengelola keuangan pribadi: user memiliki beberapa **akun** (bank/cash/e-wallet), setiap akun mencatat **transaksi** (income/expense/transfer) yang dikelompokkan ke dalam **kategori** (mis. Salary, Food, Transport). Saldo akun otomatis dihitung ulang secara atomic setiap kali transaksi dibuat, diubah, atau dihapus — termasuk transfer antar akun milik user yang sama.

Dibangun dengan NestJS + Prisma ORM + PostgreSQL.

## Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : owns
    ACCOUNT ||--o{ TRANSACTION : "source (account_id)"
    ACCOUNT ||--o{ TRANSACTION : "destination transfer (to_account_id)"
    CATEGORY ||--o{ TRANSACTION : categorizes

    USER {
        int id PK
        string name
        string email UK
        string password "bcrypt hash"
        enum role "User | Admin"
        datetime created_at
        datetime updated_at
    }
    ACCOUNT {
        int id PK
        string name
        enum type "cash | bank | ewallet"
        decimal balance
        datetime created_at
        int user_id FK
    }
    CATEGORY {
        int id PK
        string name
        enum type "income | expense"
    }
    TRANSACTION {
        int id PK
        enum type "income | expense | transfer"
        decimal amount
        string description
        datetime transaction_date
        datetime created_at
        int account_id FK
        int category_id FK
        int to_account_id FK "nullable, diisi jika type=transfer"
    }
```

## Arsitektur singkat

Tiap resource (`users`, `accounts`, `categories`, `transactions`, `auth`) punya modul sendiri dengan pola `Controller -> Service -> Repository`:

- **Controller** — routing, validasi input (DTO), ambil `req.user` dari JWT.
- **Service** — business logic & authorization (ownership check, hitung efek saldo).
- **Repository** — satu-satunya lapisan yang bicara ke Prisma.

### Kenapa `BalanceCalculatorService` dipisah jadi provider sendiri

Logic "berapa efek sebuah transaksi terhadap saldo akun" (`income` nambah, `expense`/`transfer` ngurangin, `transfer` mengurangi satu akun dan menambah akun lain) sengaja dijadikan `@Injectable()` provider terpisah (`src/transactions/balance-calculator.service.ts`), bukan fungsi bebas atau logic yang menempel di repository. Alasannya:

1. **Testability** — `BalanceCalculatorService` bisa di-unit-test sendiri (input type+amount+akun → output efek saldo) tanpa perlu database sama sekali, dan bisa di-mock lewat `useValue`/`useClass` saat menguji `TransactionsService` tanpa menjalankan Prisma.
2. **Single responsibility** — repository jadi murni layer persistence (terima efek saldo yang sudah dihitung, eksekusi atomic lewat `$transaction`), tidak perlu tahu aturan bisnis income/expense/transfer.
3. **Reuse** — kalau nanti dibutuhkan di modul lain (mis. laporan/rekalkulasi saldo), provider ini tinggal di-inject, tidak perlu duplikasi logic.

## Environment Variables

Salin ke `.env` di root project:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fintrack?schema=public"
MAINTENANCE_MODE='false'

JWT_SECRET="ganti-dengan-secret-yang-panjang-dan-acak"
JWT_EXPIRES_IN=86400
```

| Variable           | Keterangan                                                   |
| ------------------ | ------------------------------------------------------------ |
| `DATABASE_URL`     | Connection string PostgreSQL                                 |
| `MAINTENANCE_MODE` | `'true'` untuk mematikan sementara semua endpoint (503)      |
| `JWT_SECRET`       | Secret untuk sign/verify JWT — **wajib diganti** saat deploy |
| `JWT_EXPIRES_IN`   | Masa berlaku token dalam detik (default 86400 = 1 hari)      |

## Cara run lokal

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan database PostgreSQL lokal

Buat database kosong (mis. `fintrack`), lalu isi `DATABASE_URL` di `.env` sesuai kredensial lokal.

### 3. Jalankan migration + generate Prisma Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Isi data awal (seed)

```bash
npx prisma db seed
```

Ini akan mengisi 3 user, 6 akun (2 per user), 6 kategori, dan 24 transaksi contoh (lihat `prisma/seed.ts`).

### 5. Jalankan aplikasi

```bash
npm run start:dev
```

Server default di `http://localhost:3000`.

### 6. Buka dokumentasi API (Swagger)

```
http://localhost:3000/docs
```

## Menjalankan file SQL manual (opsional)

Selain lewat Prisma, skema & seed juga tersedia dalam SQL murni di folder `db/` untuk dijalankan langsung ke Postgres lokal:

```bash
psql -U postgres -d fintrack -f db/schema.sql
psql -U postgres -d fintrack -f db/seed.sql
```

Contoh query analitik (filtered SELECT, 3-table JOIN, GROUP BY, subquery, window function, LEFT JOIN) ada di `db/queries.sql` — jalankan satu per satu lewat `psql` atau client SQL apa pun.

## Autentikasi & Otorisasi

- **Register**: `POST /auth/register` — body `{ name, email, password }`, mengembalikan `{ access_token, user }`. Password di-hash dengan `bcrypt` sebelum disimpan.
- **Login**: `POST /auth/login` — body `{ email, password }`, mengembalikan `{ access_token, user }`. Dibatasi 5 request/menit per IP untuk mencegah brute-force.
- Endpoint lain (selain `/auth/*` dan `GET /`) membutuhkan header `Authorization: Bearer <access_token>`.
- Beberapa endpoint (mis. semua endpoint di bawah header `x-api`, warisan dari milestone sebelumnya) juga tetap membutuhkan header `x-api: RevoU2026`.

### Role & RBAC

- `User` — hanya bisa akses/ubah resource miliknya sendiri (akun, transaksi, data dirinya).
- `Admin` — bisa akses semua resource, dan satu-satunya role yang boleh mengelola `categories` (data master bersama) serta melihat daftar semua user.

### Ownership enforcement

- Akun (`accounts`) dan transaksi (`transactions`) hanya bisa diakses/diubah oleh pemilik akun terkait atau Admin.
- Transfer (`type: "transfer"`) hanya diperbolehkan antara dua akun milik user yang sama.
- Mencoba mengakses/mengubah resource milik user lain akan mengembalikan `403 Forbidden`.

## Live Deployment

_(akan diisi setelah proses deploy — lihat rencana di bawah)_

Rencana: deploy ke Railway/Render dengan `DATABASE_URL` mengarah ke database Postgres hosted, `JWT_SECRET` di-generate ulang khusus untuk production.

## Smoke Test

Lihat [`docs/api-smoke-test.md`](docs/api-smoke-test.md) untuk skenario smoke test manual (register → login → CRUD → contoh request yang diblokir).

Koleksi Postman tersedia di [`docs/fintrack-api.postman_collection.json`](docs/fintrack-api.postman_collection.json).
