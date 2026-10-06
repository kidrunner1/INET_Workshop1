# E-commerce Backend API

REST API สำหรับร้านค้าออนไลน์ พัฒนาด้วย Node.js, Express และ MongoDB รองรับระบบสมาชิก การยืนยันตัวตนด้วย JWT และการจัดการสินค้าและคำสั่งซื้อ

## เริ่มใช้งาน

1. ติดตั้ง Node.js และเตรียม MongoDB จากนั้นติดตั้ง dependencies:

   ```bash
   npm install
   ```

2. เริ่มเซิร์ฟเวอร์สำหรับพัฒนา:

   ```bash
   npm run dev
   ```

API ใช้ URL หลัก `http://localhost:3000/api/v1` หรือรันด้วย `npm start` เมื่อต้องการเริ่มเซิร์ฟเวอร์โดยไม่ใช้ nodemon

ไฟล์ `.env` และ `node_modules` ถูกยกเว้นจาก Git ด้วย `.gitignore`
