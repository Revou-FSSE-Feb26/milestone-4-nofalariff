# API Smoke Test — FinTrack API

Dijalankan manual via `curl` melawan `npm run start:dev` (localhost:3000), setelah `npx prisma migrate dev` + `npx prisma generate` + `npx prisma db seed`. Semua request di bawah **wajib** menyertakan header `x-api: RevoU2026` (lihat `AuthHeaderMiddleware`) di samping `Authorization: Bearer <token>` untuk route yang protected.

Status: **lolos semua skenario** (dijalankan 2026-08-17).

## 1. Auth flow

### Register

```
POST /auth/register
{ "name": "Test Budi", "email": "testbudi@example.com", "password": "password123" }
```
→ `201`, `{ access_token, user: { id, email, role: "User" } }`

### Login

```
POST /auth/login
{ "email": "testsiti@example.com", "password": "password123" }
```
→ `200`, `{ access_token, user }`

### Rate limiting login (anti brute-force)

7 request `POST /auth/login` beruntun (password salah) dari IP yang sama dalam &lt;60 detik:

| Request ke- | Status |
|---|---|
| 1–4 | `401 Unauthorized` (password salah, request masih dihitung) |
| 5–7 | `429 Too Many Requests` |

Limit: 5 request/menit per IP ke `/auth/login` (lihat `@Throttle` di `auth.controller.ts`).

## 2. Proteksi endpoint (JWT + x-api)

| Request | Hasil |
|---|---|
| `GET /accounts` tanpa header apa pun | `401 Missing API Header` |
| `GET /accounts` dengan `x-api` tapi tanpa `Authorization` | `401 Unauthorized` |
| `GET /accounts` dengan `x-api` + JWT valid | `200`, `[]` (akun kosong untuk user baru) |

## 3. Ownership enforcement

| Skenario | Hasil |
|---|---|
| User A `POST /accounts` dengan `user_id` = dirinya sendiri | `201 Created` |
| User A `POST /accounts` dengan `user_id` milik User B (**blocked-request example**) | `403 Forbidden` — *"Tidak boleh membuat akun untuk user lain"* |
| User B `GET /accounts/:id` milik User A | `403 Forbidden` — *"Anda tidak berhak mengakses resource milik user lain"* |
| User B `GET /users/:id` milik User A | `403 Forbidden` |
| User A `GET /users/:id` milik dirinya sendiri | `200 OK` |
| User A transfer dari akunnya ke akun User B | `403 Forbidden` — *"Transfer hanya diperbolehkan antar akun milik user yang sama"* |

## 4. RBAC (role Admin vs User)

| Skenario | Hasil |
|---|---|
| Role `User` — `POST /categories` | `403 Forbidden` — *"Role User tidak diizinkan mengakses resource ini"* |
| Role `Admin` — `POST /categories` | `201 Created` |
| Role `User` — `GET /categories` (baca) | `200 OK` (boleh, RBAC hanya membatasi mutasi) |
| Role `Admin` — `GET /users` | `200 OK`, daftar semua user |

## 5. Password tidak pernah ter-expose

`GET /users` (Admin) dan `GET /users/:id` — field `password` **tidak muncul** di response JSON (di-`omit` di level query Prisma).

## 6. Transfer antar akun sendiri (efek saldo)

Akun sumber (id 7, saldo awal 1.000.000) → transfer 300.000 → akun tujuan (id 8, saldo awal 0):

| Akun | Sebelum | Sesudah |
|---|---|---|
| Sumber (7) | 1.000.000 | 700.000 |
| Tujuan (8) | 0 | 300.000 |

Transaksi dihapus lagi → kedua saldo otomatis kembali ke nilai semula (efek dibatalkan/reverted secara atomic).

## 7. Header keamanan (helmet) & CORS

- Response header menyertakan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (dari `helmet()`).
- `OPTIONS` preflight request mengembalikan `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` (dari `app.enableCors()`).

## Cleanup

Semua data yang dibuat selama smoke test (user, akun, kategori, transaksi test) dihapus kembali setelah pengujian lewat endpoint DELETE masing-masing — database kembali ke kondisi seed murni (3 user, 6 akun, 6 kategori, 24 transaksi).
