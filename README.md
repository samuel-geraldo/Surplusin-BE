# Food Security & Waste Management

## Alur Register

1. User membuka halaman register
2. User memilih role (Penyalur / Penerima) → role otomatis terisi sesuai tombol yang dipencet
3. User mengisi email & password lalu submit
   - `POST /api/auth/register` → simpan ke tabel `users`
   - Response: token JWT + role
4. User diarahkan ke halaman form data sesuai role
   - Penyalur → isi nama toko, kategori, nomor WhatsApp, alamat, lokasi
   - Penerima → isi nama instansi, kategori, nomor WhatsApp, alamat, lokasi
5. User submit form → `POST /api/penyalur/register` atau `POST /api/penerima/register`
6. Data tersimpan ke database → onboarding selesai