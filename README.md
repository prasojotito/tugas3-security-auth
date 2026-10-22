# Tugas 3 — Validasi, Error, dan Auth (Review Kantin Kampus)

REST API Review Kantin Kampus, lanjutan dari Tugas 2. Pada tugas ini ditambahkan:

- **Validasi input** dengan **Zod**, dengan **satu format error** yang seragam.
- **Autentikasi** dengan **JWT**.
- **Otorisasi berbasis role** (`admin`, `owner`, `customer`) dengan pembeda yang jelas antara **401** dan **403**.
- **Dokumentasi API** (Swagger/OpenAPI) di `/docs`.

Arsitektur tetap berlapis: Router → Controller → Service → Repository, dengan akses data memakai Drizzle ORM ke SQL Server.

## Tech Stack

| Komponen     | Teknologi                                       |
|--------------|-------------------------------------------------|
| Runtime      | Node.js >= 22.18.0, TypeScript (dijalankan via `tsx`) |
| Framework    | Express                                         |
| Database     | SQL Server (`mssql`) + Drizzle ORM              |
| Validasi     | Zod                                             |
| Autentikasi  | JWT (`jsonwebtoken`), hash password (`bcrypt`)  |
| Dokumentasi  | `swagger-autogen` + `swagger-ui-express`        |

## Prasyarat

- Node.js >= 22.18.0 dan npm
- SQL Server aktif, dengan database `review_kantin` sudah disiapkan (skema DDL dan seed dari Tugas 2)

```bash
sqlcmd -S localhost -E -C -i db\00-setup-mixed-mode.sql
sqlcmd -S localhost -E -C -i db\01-create-database-and-user.sql
sqlcmd -S localhost -E -C -i db\02-schema.sql
sqlcmd -S localhost -E -C -i db\03-seed.sql
```

> Sesuaikan path file `.sql` dengan lokasi di komputer kamu.

## Instalasi & Menjalankan

```bash
# 1. Clone repo
git clone https://github.com/prasojotito/tugas3-security-auth.git
cd tugas3-security-auth

# 2. Install dependencies
npm install

# 3. Salin konfigurasi environment, lalu isi nilainya
copy .env.example .env        # Windows (PowerShell: Copy-Item .env.example .env)
# cp .env.example .env        # Linux/macOS

# 4. Jalankan server (otomatis generate dokumentasi Swagger)
npm run dev
```

Server berjalan di `http://localhost:3000` dan dokumentasi API di `http://localhost:3000/docs`.

## Konfigurasi Environment

Salin `.env.example` menjadi `.env`. File `.env` **tidak** ikut ter-commit.

```env
# Database
DB_SERVER=localhost
DB_PORT=1433
DB_USER=praktikum_user
DB_PASSWORD=isi_password_database
DB_NAME=review_kantin
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# JWT
JWT_SECRET=ganti_dengan_secret_acak_yang_panjang
JWT_EXPIRES_IN=1h
```

> Nilai yang mengandung `#` wajib dibungkus tanda kutip (dotenv menganggap `#` sebagai komentar).

## Script

| Script             | Fungsi                                                      |
|--------------------|-------------------------------------------------------------|
| `npm run dev`      | Menjalankan server mode watch (menjalankan `docs:gen` dulu) |
| `npm start`        | Menjalankan server (menjalankan `docs:gen` dulu)            |
| `npm run docs:gen` | Menghasilkan `src/docs/swagger-output.json`                 |

## Role & Hak Akses

| Role     | Hak Akses                          |
|----------|------------------------------------|
| `admin`  | Semua endpoint                     |
| `owner`  | Endpoint untuk mengelola warung **miliknya sendiri** |
| `customer` | Menambah review                  |
| public (tanpa role) | Endpoint publik dan auth |

Identitas user (id dan role) **selalu diambil dari token JWT**, bukan dari request body. Registrasi lewat `POST /auth/register` tidak menerima field `role` dari klien.

## Daftar Endpoint & Otorisasi

| Method | Endpoint                | Akses                                | Keterangan                          |
|--------|-------------------------|--------------------------------------|-------------------------------------|
| POST   | `/auth/register`        | Publik                               | Daftar akun baru                    |
| POST   | `/auth/login`           | Publik                               | Login, mengembalikan token JWT      |
| GET    | `/auth/me`              | Login (semua role)                   | Data user dari token                |
| GET    | `/stalls`               | Publik                               | Daftar warung (search, filter, pagination) |
| GET    | `/stalls/:id`           | Publik                               | Detail warung                       |
| POST   | `/stalls`               | `owner`, `admin`                     | Buat warung                         |
| PUT    | `/stalls/:id`           | `owner` (hanya miliknya), `admin`    | Ubah warung                         |
| DELETE | `/stalls/:id`           | `admin`                              | Hapus warung                        |
| POST   | `/stalls/:id/reviews`   | Login (semua role)                   | Tambah review pada warung           |

Endpoint lain dari Tugas 2 (users, menu-items, likes, flags, audit) tetap tersedia dengan prefix `/api/v1`. Daftar lengkap dan skema request/response ada di `/docs`.

## Autentikasi (JWT)

1. Daftar lewat `POST /auth/register`, lalu login lewat `POST /auth/login`.
2. Ambil `token` dari response login.
3. Kirim token pada setiap request ke endpoint yang membutuhkan login:

```
Authorization: Bearer <token>
```

Di Swagger UI (`/docs`), klik **Authorize** lalu isi `Bearer <token>`.

Password **di-hash (bcrypt) sebelum disimpan** ke database; password asli tidak pernah disimpan maupun dikembalikan pada response.

## Perbedaan 401 dan 403

| Status | Arti                                        | Contoh kasus                                                    |
|--------|---------------------------------------------|-----------------------------------------------------------------|
| `401 Unauthorized` | Belum / tidak terautentikasi    | Tidak ada header `Authorization`, token tidak valid atau kedaluwarsa |
| `403 Forbidden`    | Sudah login, tetapi tidak punya akses | `customer` memanggil `POST /stalls`; `owner` mengubah warung milik owner lain; `owner` memanggil `DELETE /stalls/:id` |

## Format Error

Semua error memakai satu format yang sama:

```json
{
  "status": "fail",
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "name minimal 3 karakter" },
    { "field": "password", "message": "password minimal 8 karakter" }
  ]
}
```

Untuk error non-validasi (misalnya 401, 403, 404), field `errors` dapat dihilangkan dan `message` berisi penjelasan singkat:

```json
{ "status": "fail", "message": "Token tidak valid atau tidak ditemukan" }
```

| Status | Penyebab                                           |
|--------|----------------------------------------------------|
| `400`  | Validasi gagal (body, params, atau query)          |
| `401`  | Belum / tidak terautentikasi                       |
| `403`  | Role tidak memenuhi atau bukan pemilik resource    |
| `404`  | Resource tidak ditemukan                           |
| `409`  | Konflik data (misalnya email sudah terdaftar)      |
| `500`  | Kesalahan server                                   |

## Skema Validasi (Zod)

| Endpoint                    | Sumber            | Aturan |
|-----------------------------|-------------------|--------|
| `GET /stalls`               | query             | `search`: string, trim, maks 100, opsional · `category`: string, trim, maks 50, opsional · `page`: int, min 1, default 1 · `limit`: int, min 1, maks 100, default 10 |
| `GET /stalls/:id`           | params            | `id`: int, > 0, wajib |
| `POST /stalls`              | body              | `name`: string, trim, 3..100, wajib · `category`: string, trim, maks 50, opsional · `location`: string, maks 100, opsional · `description`: maks 1000, opsional |
| `PUT /stalls/:id`           | params + body     | `id`: int, > 0, wajib · body: versi parsial dari `POST /stalls` (semua opsional) |
| `DELETE /stalls/:id`        | params            | `id`: int, > 0, wajib |
| `POST /stalls/:id/reviews`  | params + body     | `id`: int, > 0, wajib · `rating`: int, 1..5, wajib · `comment`: string, trim, maks 1000, opsional |
| `POST /auth/register`       | body              | `name`: string, trim, 3..100, wajib · `email`: format email, trim, lowercase, maks 150, wajib · `password`: 8..72 karakter, wajib |
| `POST /auth/login`          | body              | `email`: format email, trim, lowercase, wajib · `password`: minimal 1 karakter, wajib |
| `GET /auth/me`              | header            | Tidak ada body/params (token dibaca dari header `Authorization`) |

## Contoh Penggunaan

**Register**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi Santoso","email":"budi@example.com","password":"rahasia123"}'
```

**Login**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@example.com","password":"rahasia123"}'
```

**Akses endpoint yang butuh login**

```bash
curl http://localhost:3000/auth/me -H "Authorization: Bearer <token>"
```

**Tanpa token → 401**

```bash
curl -i -X POST http://localhost:3000/stalls \
  -H "Content-Type: application/json" \
  -d '{"name":"Warung Baru"}'
```

**Role tidak memenuhi → 403** (login sebagai `customer`, lalu buat warung)

```bash
curl -i -X POST http://localhost:3000/stalls \
  -H "Authorization: Bearer <token-customer>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Warung Baru"}'
```

File `test.http` berisi kumpulan request siap pakai (ekstensi REST Client di VS Code).

## Akun Uji

Akun dibuat lewat `POST /auth/register` atau seed database. Isi tabel berikut dengan akun yang kamu pakai untuk pengujian:

| Role       | Email | Password |
|------------|-------|----------|
| `admin`    | _isi_ | _isi_    |
| `owner`    | _isi_ | _isi_    |
| `customer` | _isi_ | _isi_    |

## Struktur Project

```
tugas3-security-auth/
├─ README.md
├─ .env.example
├─ drizzle.config.ts
├─ package.json  tsconfig.json
├─ test.http
└─ src/
   ├─ db/            # schema.ts (pemetaan tabel), index.ts (koneksi Drizzle)
   ├─ docs/          # swagger.ts (generator), swagger-output.json (hasil generate, gitignored)
   ├─ schemas/       # skema Zod per endpoint
   ├─ middlewares/   # validate, authenticate (401), authorize (403), error handler
   ├─ routes/
   ├─ controllers/
   ├─ services/
   ├─ repositories/
   ├─ dtos/
   └─ index.ts
```

> Sesuaikan nama folder dengan struktur yang sebenarnya di repo.

## Catatan

- Dokumentasi di `/docs` dihasilkan oleh `swagger-autogen` dan berformat **Swagger 2.0**; skema keamanan JWT didefinisikan sebagai `securityDefinitions` (bearer).
- `src/docs/swagger-output.json` adalah hasil generate dan tidak diedit manual.
- Drizzle untuk MSSQL masih berstatus RC, sehingga versinya dipatok pada `package.json`.