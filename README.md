# RelawanDesa (Smart Village Platform)

RelawanDesa adalah sistem fullstack modern berskala *Smart Village* yang dirancang untuk memfasilitasi manajemen kegiatan sosial pedesaan dan partisipasi relawan. Platform ini dibangun menggunakan arsitektur modular *Clean Architecture* dan terdiri dari tiga aplikasi utama: Backend API yang tangguh, Web Admin Panel yang elegan, dan Aplikasi Mobile yang interaktif bagi para relawan.

---

## Fitur Utama Sistem

### 1. Backend API (NestJS)
- **Role-based Authentication:** JWT Bearer authentication terenkripsi untuk Admin dan User biasa.
- **Relasional Database Kuat:** Prisma ORM (v7) dengan MySQL yang mengatur *many-to-many relationship* antara User dan Kegiatan.
- **RESTful Endpoints:** Layanan terstruktur untuk mengelola user, kegiatan sosial, dan pencatatan riwayat partisipasi relawan secara presisi.

### 2. Web Admin Panel (Next.js)
- **Modern Glassmorphism UI:** Antarmuka responsif berbasis TailwindCSS dengan estetika *emerald-green* yang profesional.
- **Dashboard Overview:** Analitik dan ringkasan *real-time* jumlah kegiatan, pengguna terdaftar, dan tingkat partisipasi.
- **Full CRUD Management:** Sistem manajemen mudah untuk membuat, memperbarui, dan menghapus kegiatan sosial.
- **Monitoring Tools:** Kemampuan memantau daftar relawan yang tergabung dalam tiap-tiap kegiatan.

### 3. Mobile App (React Native Expo)
- **Registrasi Mudah:** Akses cepat bagi warga desa untuk mendaftarkan diri menjadi relawan.
- **Eksplorasi Kegiatan:** Tampilan daftar kegiatan sosial lengkap beserta jumlah relawan yang telah bergabung, tanggal, dan lokasi.
- **Quick Join:** Sistem 1-klik yang memudahkan relawan untuk mengonfirmasi kehadiran di suatu kegiatan sosial secara *real-time*.

---

## Tech Stack (Teknologi yang Digunakan)

*   **Backend:** [NestJS](https://nestjs.com/) (TypeScript), MySQL, [Prisma ORM](https://www.prisma.io/), Bcrypt, Passport JWT.
*   **Frontend (Admin Web):** [Next.js](https://nextjs.org/) 15 (React), [TailwindCSS](https://tailwindcss.com/) terintegrasi via global CSS, Axios.
*   **Mobile (User App):** [React Native](https://reactnative.dev/) berbasis [Expo](https://expo.dev/), React Navigation, Expo Secure Store.
*   **Version Control:** Git & GitHub dengan commit granular per fitur.

---

## Cara Menjalankan Proyek Secara Lokal

Proyek ini telah dikonfigurasi sedemikian rupa agar mudah dijalankan secara independen. Ikuti langkah-langkah di bawah ini:

### 1. Persiapan Database & Backend
1. Pastikan Anda memiliki server MySQL (XAMPP/MAMP/Docker) berjalan di port `3306`.
2. Buka terminal baru dan masuk ke folder backend:
   ```bash
   cd backend
   ```
3. Sesuaikan file `.env` di dalam folder backend (secara default sudah tersetting ke localhost/relawandesa).
4. Install dependensi dan jalankan migrasi database:
   ```bash
   npm install
   npx prisma migrate dev --name init
   ```
5. Jalankan server backend (API akan berjalan di `http://localhost:3000`):
   ```bash
   npm run start:dev
   ```

### 2. Menjalankan Web Admin (Frontend)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend-admin
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan server Next.js (Admin panel akan berjalan di `http://localhost:3001` atau port terdekat yang kosong):
   ```bash
   npm run dev
   ```

### 3. Menjalankan Aplikasi Mobile (User)
1. Buka terminal baru dan masuk ke folder mobile:
   ```bash
   cd mobile-user
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. *(Opsional)* Sesuaikan `API_URL` pada file `src/lib/api.ts` jika Anda menggunakan perangkat fisik untuk pengujian (ganti ke IP lokal WiFi Anda).
4. Jalankan Expo Metro Bundler:
   ```bash
   npx expo start
   ```
   *Anda dapat menekan tombol `a` untuk membuka di Android Emulator, atau melakukan scan QR Code dengan aplikasi Expo Go di HP Anda.*

---

## Lisensi & Penafian
Proyek ini dibuat sebagai prototipe infrastruktur perangkat lunak *Smart Village* modern dan dapat diadaptasi bebas untuk kebutuhan desa-desa di seluruh Indonesia.
