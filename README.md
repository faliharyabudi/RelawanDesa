# RelawanDesa

RelawanDesa adalah sebuah aplikasi mobile dan sistem manajemen yang dirancang untuk mempermudah kegiatan sosial dan partisipasi relawan di desa. Aplikasi ini dibuat untuk menjembatani antara pengelola desa (sebagai pembuat kegiatan) dan masyarakat (sebagai relawan).

Melalui sistem ini, kegiatan sosial seperti gotong royong, posyandu, hingga penyuluhan dapat didokumentasikan dan diikuti oleh warga secara digital dengan mudah dan transparan.

---

## Fokus dan Fungsi Aplikasi

Aplikasi ini dibagi menjadi dua peran utama: **Relawan (User Biasa)** dan **Pengelola (Admin)**.

### Fungsi untuk Relawan (Masyarakat):
1. **Mendaftar dan Masuk:** Warga desa dapat membuat akun secara mandiri langsung dari aplikasi mobile.
2. **Eksplorasi Kegiatan:** Warga dapat melihat seluruh daftar kegiatan sosial yang sedang aktif beserta detail waktu dan lokasinya.
3. **Mendaftar Kegiatan:** Warga cukup menekan satu tombol "Daftar Sebagai Relawan" untuk langsung tercatat sebagai partisipan pada suatu kegiatan.
4. **Riwayat Keterlibatan:** Warga memiliki riwayat kegiatan apa saja yang pernah mereka ikuti, serta diberikan pilihan untuk membatalkan pendaftaran jika berhalangan hadir.

### Fungsi untuk Admin (Pengelola Desa):
1. **Manajemen Kegiatan:** Admin dapat menambahkan kegiatan baru (seperti kerja bakti, bantuan sosial, dll) lengkap dengan jadwal dan tempat. Penambahan ini bisa dilakukan langsung lewat aplikasi mobile maupun dasbor web.
2. **Pemantauan Relawan:** Admin dapat melihat daftar warga yang mendaftar pada setiap kegiatan secara real-time, memudahkan pengelola untuk menyiapkan konsumsi atau perlengkapan.
3. **Statistik Terpusat:** Admin dapat melihat total partisipasi dan keaktifan warga dalam berbagai kegiatan desa.

---

## Alur Cara Menggunakan Aplikasi (Bagi Pengguna)

1. **Akses Aplikasi Mobile:**
   Buka aplikasi RelawanDesa dari ponsel. Anda akan disambut oleh halaman Login.
   
2. **Pembuatan Akun Baru:**
   Jika belum memiliki akun, klik "Daftar Akun Baru". Isi nama lengkap, alamat email, dan password Anda.
   
3. **Mencari Kegiatan Sosial:**
   Setelah masuk, halaman utama (Beranda) akan langsung menampilkan daftar kegiatan desa. Klik salah satu kegiatan untuk melihat deskripsi lengkapnya.
   
4. **Mendaftar Sebagai Relawan:**
   Di dalam halaman detail kegiatan, cukup klik tombol **Daftar Sebagai Relawan**. Sistem akan otomatis mencatat Anda ke dalam daftar partisipan.

5. **Mengecek Riwayat:**
   Akses menu **Riwayat** di navigasi bawah untuk melihat daftar kegiatan yang sudah Anda daftar. Jika ada perubahan jadwal pribadi, Anda dapat membatalkan pendaftaran lewat menu ini.

## Cara Mengakses Mode Admin (Pengelola)

Secara bawaan, semua orang yang mendaftar lewat aplikasi akan berstatus sebagai "Relawan". Untuk mengelola kegiatan, Anda membutuhkan akses khusus.

1. Buka database proyek (menggunakan `Prisma Studio`).
2. Cari data akun Anda di tabel **User**.
3. Ubah kolom `role` (peran) dari `USER` menjadi `ADMIN`.
4. Buka kembali aplikasi mobile, lalu tekan tombol "Keluar Akun" (Logout) dan login kembali.
5. Tombol **"+ Tambah Kegiatan"** sekarang akan muncul secara otomatis di aplikasi Anda.

---

## Ringkasan Struktur Sistem
- **Aplikasi Mobile (Frontend):** Digunakan warga untuk mendaftar dan melihat kegiatan.
- **Server (Backend):** Mesin utama pengolah data yang menyimpan informasi pengguna dan riwayat secara aman.
- **Web Dasbor (Admin):** Digunakan pengelola secara khusus untuk melihat rekap data dalam layar yang lebih besar.
