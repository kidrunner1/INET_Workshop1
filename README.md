# E-commerce Backend API

REST API สำหรับร้านค้าออนไลน์ พัฒนาด้วย Node.js, Express และ MongoDB รองรับระบบสมาชิก การยืนยันตัวตนด้วย JWT และการจัดการสินค้าและคำสั่งซื้อ

## เริ่มใช้งาน

1. ติดตั้ง Node.js และเตรียม MongoDB จากนั้นติดตั้ง dependencies:

   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env` ที่โฟลเดอร์หลัก และกำหนดค่าตามสภาพแวดล้อมของคุณ:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
   JWT_SECRET=replace_with_a_long_random_secret
   ```

3. เริ่มเซิร์ฟเวอร์สำหรับพัฒนา:

   ```bash
   npm run dev
   ```

API ใช้ URL หลัก `http://localhost:3000/api/v1` หรือรันด้วย `npm start` เมื่อต้องการเริ่มเซิร์ฟเวอร์โดยไม่ใช้ nodemon

ไฟล์ `.env` และ `node_modules` ถูกยกเว้นจาก Git ด้วย `.gitignore`
