# RelawanDesa (Smart Village Platform) 🌿

**RelawanDesa** adalah sistem *full-stack* modern berskala *Smart Village* yang dirancang untuk memfasilitasi manajemen kegiatan sosial pedesaan dan partisipasi relawan secara terpusat. Platform ini dibangun menggunakan arsitektur modular *Clean Architecture* dan terdiri dari tiga aplikasi utama: Backend API yang tangguh, Web Admin Panel yang elegan, dan Aplikasi Mobile modern yang interaktif.

---

## ✨ Pembaruan Fitur Terbaru (Versi 1.0)
- **UI/UX Modern Premium:** Desain mobile terbaru dengan tema *emerald green*, *gradient style* (menggunakan `expo-linear-gradient`), dan animasi perpindahan yang *smooth*.
- **Admin Mobile Mode:** Fitur eksklusif bagi administrator untuk langsung menambah kegiatan (beserta tanggal, lokasi, dan deskripsi) langsung dari perangkat *mobile*.
- **Live Statistics:** Banner data statistik *real-time* yang menampilkan jumlah partisipan/relawan di beranda dan halaman riwayat kegiatan.
- **Smart Unjoin:** Relawan dapat membatalkan partisipasi (batal mendaftar) langsung dari menu detail atau histori, disertai konfirmasi dialog pengaman.

---

## 🚀 Fitur Utama Sistem

### 1. Aplikasi Mobile (React Native + Expo)
Aplikasi yang digunakan secara langsung oleh warga desa/relawan dengan desain visual premium yang sangat memanjakan mata.
- **Registrasi & Autentikasi:** Mendaftar akun dan login secara mulus dengan sistem penyimpanan token aman.
- **Eksplorasi Kegiatan (Beranda):** Tampilan daftar kegiatan dengan informasi rinci lokasi, tanggal, jumlah relawan terdaftar.
- **Mode Administrator:** Jika login sebagai Admin, beranda akan memunculkan spanduk peringatan Admin dan tombol **"+ Tambah"** untuk membuat *event* / kegiatan baru.
- **Detail Kegiatan:** Tampilan detil *hero section* ber-gradasi dan status (*badge*) real-time ("✅ Anda sudah terdaftar").
- **Manajemen Riwayat:** Menu Histori untuk melihat daftar seluruh kegiatan yang telah diikuti dan tombol untuk membatalkan pendaftaran.
- **Profil Akun:** Halaman informasi pribadi yang mengambil data langsung dari server, beserta keterangan total partisipasi.

### 2. Backend API (NestJS)
- **Role-based Authentication:** Keamanan menggunakan *JWT Bearer authentication* terenkripsi untuk memisahkan peran antara pengguna biasa (`USER`) dan administrator (`ADMIN`).
- **Relasional Database Kuat:** Prisma ORM (v5) dengan database MySQL yang mengatur *many-to-many relationship* antara pengguna dan berbagai kegiatan secara presisi.
- **RESTful Endpoints Terstruktur:** Layanan terstruktur untuk mengelola user (`/api/users/me`), kegiatan sosial (`/api/activities`), relawan, hingga pembatalan kegiatan (`DELETE /api/users/me/activities/:id`).

### 3. Web Admin Panel (Next.js)
- **Modern Glassmorphism UI:** Antarmuka responsif berbasis TailwindCSS dengan estetika *emerald-green* yang profesional.
- **Dashboard Overview:** Analitik *real-time* yang memberikan informasi ringkas mengenai seluruh database (Jumlah relawan, kegiatan berjalan, dll).

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

*   **Backend:** [NestJS](https://nestjs.com/) (TypeScript), MySQL, [Prisma ORM](https://www.prisma.io/), Bcrypt, Passport JWT.
*   **Mobile (User App):** [React Native](https://reactnative.dev/) berbasis [Expo](https://expo.dev/), React Navigation, Expo Linear Gradient.
*   **Frontend (Admin Web):** [Next.js](https://nextjs.org/) 15 (React App Router), [TailwindCSS](https://tailwindcss.com/) terintegrasi via global CSS, Axios.
*   **Version Control:** Git & GitHub dengan commit secara terstruktur per fitur.

---

## 📖 Cara Menjalankan Proyek Secara Lokal

Proyek ini telah dikonfigurasi sedemikian rupa agar mudah dijalankan secara independen. Ikuti langkah-langkah di bawah ini:

### Tahap 1: Persiapan Database & Backend
1. Pastikan Anda memiliki server MySQL (XAMPP/MAMP/Docker) yang berjalan di `localhost` (Port: `3306`).
2. Buka terminal, masuk ke folder backend:
   ```bash
   cd backend
   ```
3. Sesuaikan koneksi di file `.env` di dalam folder backend (secara default sudah tersetting ke `mysql://root:123456@localhost:3306/relawandesa`).
4. Install dependensi dan jalankan sinkronisasi database:
   ```bash
   npm install
   npx prisma db push
   ```
   *(Opsional)* Anda dapat menggunakan `npx prisma studio` untuk memanipulasi data dan mengganti role pengguna Anda dari `USER` menjadi `ADMIN`.
5. Jalankan server backend (API berjalan di `http://localhost:3000`):
   ```bash
   npm run start:dev
   ```

### Tahap 2: Menjalankan Aplikasi Mobile
1. Buka terminal baru dan masuk ke folder aplikasi mobile:
   ```bash
   cd mobile-user
   ```
2. Install seluruh dependensi UI dan Navigasi:
   ```bash
   npm install
   ```
3. *(Penting)* Sesuaikan IP Address `API_URL` pada file `src/lib/api.ts` jika Anda menggunakan *smartphone* fisik via koneksi WiFi (Ganti `localhost` menjadi IP WiFi laptop Anda).
4. Jalankan Expo Metro Bundler:
   ```bash
   npx expo start
   ```
   *Gunakan HP Android/iOS Anda dengan aplikasi "Expo Go" untuk scan QR Code yang muncul di layar terminal.*

### Tahap 3: Menjalankan Web Admin (Opsional)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend-admin
   ```
2. Install dependensi dan jalankan server Next.js:
   ```bash
   npm install
   npm run dev
   ```
   *Dashboard Admin panel akan berjalan di `http://localhost:3001`.*

---

## 👨‍💻 Hak Akses & Peran Pengguna
Saat Anda melakukan registrasi melalui aplikasi, role secara bawaan adalah `USER`. Untuk memunculkan UI dan fitur Admin (seperti menambah kegiatan dari aplikasi):
1. Buka terminal backend dan ketik `npx prisma studio`
2. Buka tab `User`, ganti kolom `role` menjadi `ADMIN` dan tekan Save.
3. *Logout* dari aplikasi, lalu *Login* kembali. Selamat! Spanduk dan tombol fitur admin kini otomatis terbuka.

---

## 📜 Lisensi & Penafian
Proyek ini dibuat secara khusus sebagai purwarupa (*prototype*) infrastruktur perangkat lunak *Smart Village* modern, untuk mendukung gerakan volunterisme, dan dapat diadaptasi bebas untuk kebutuhan desa-desa di seluruh wilayah Indonesia.
