@echo off
color 0A
echo ==============================================================
echo              MEMULAI SISTEM RELAWAN DESA
echo ==============================================================
echo PENTING: Pastikan Apache dan MySQL di XAMPP sudah dijalankan!
echo Jika belum, silakan buka XAMPP Control Panel dan klik Start
echo pada Apache dan MySQL.
echo ==============================================================
echo.
pause

echo.
echo [1/3] Menyiapkan Backend (NestJS)...
start cmd /k "title Backend API && cd api && npm run start:dev"

echo [2/3] Menyiapkan Frontend Admin (Next.js)...
start cmd /k "title Frontend Admin && cd cms && npm install && npm run dev"

echo [3/3] Menyiapkan Mobile User (Expo)...
start cmd /k "title Mobile User && cd user && npm install && npx expo start"

echo.
echo ==============================================================
echo Semua layanan sedang dijalankan di window terpisah!
echo.
echo Akses layanan melalui browser:
echo - Backend API     : http://localhost:3000
echo - Web Admin       : http://localhost:3001 (atau 3000 jika kosong)
echo - Mobile User     : Scan QR Code di window Expo menggunakan HP
echo ==============================================================
echo.
pause
