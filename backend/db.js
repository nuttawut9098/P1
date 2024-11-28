// db.js
const { Pool } = require('pg'); // ใช้ Pool สำหรับการจัดการการเชื่อมต่อหลายๆ ครั้ง
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stm_db',
  password: '90989098',  // เปลี่ยนเป็นรหัสผ่านของคุณ
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

module.exports = pool; // ส่งออก pool ให้สามารถใช้งานในไฟล์อื่นได้
