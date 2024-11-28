const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // ใช้สำหรับอนุญาตให้ API เข้าถึงจากแหล่งอื่น
const app = express();

// ใช้ CORS เพื่อให้ Angular สามารถติดต่อกับ API ได้
app.use(cors());
app.use(express.json()); // สำหรับอ่านข้อมูล JSON

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Failed to connect to MongoDB', err);
});

// สร้าง Schema สำหรับผู้ใช้
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Endpoint สำหรับการเข้าสู่ระบบ
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // สร้าง JWT Token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Endpoint สำหรับการเพิ่มผู้ใช้ใหม่
app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // แฮชรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
