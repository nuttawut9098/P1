const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const xlsx = require('xlsx')
const {  } = require('./shiftScheduler'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
  try {
    fs.mkdirSync(uploadPath, { recursive: true }); 
    console.log(`Directory ${uploadPath} created successfully.`);
  } catch (err) {
    console.error(`Error creating directory ${uploadPath}:`, err);
  }
}
    cb(null, uploadPath);  // กำหนดที่เก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // กำหนดชื่อไฟล์ใหม่
  }
});

const upload = multer({ storage: storage });
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
// Routes สำหรับ datatable เอาไว้ใช้กับ managemaster
app.get('/datatable', (req, res) => {
  console.log('GET /datatable called');
  pool.query('SELECT * FROM datatable ORDER BY sub_seq DESC, item_seq DESC;', (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send(err);
    } else {
      res.json(result.rows);
    }
  });
});
//เอาไว้ดึงข้อมูลมา edit
  app.get('/datatable/:sub_seq/:item_seq', (req, res) => {
    const { sub_seq, item_seq } = req.params;
    const query = 'SELECT * FROM datatable WHERE sub_seq = $1 AND item_seq = $2';
    pool.query(query, [sub_seq, item_seq], (err, result) => {
      if (err) {
        console.error('Error fetching item:', err);
        res.status(500).send(err);
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: 'ไม่พบข้อมูลที่ระบุ' });
      } else {
        res.json(result.rows[0]);
      }
    });
  });

  app.post('/datatable', (req, res) => {
    console.log('Request Body:', req.body); // ตรวจสอบ Body
    const { portion, no, items, item_remind, rank, qa_network, sub_seq, item_seq, item_type, item_detail } = req.body;
  
    if (!portion || !no || !items || !item_remind || !rank || !qa_network || !sub_seq || !item_seq || !item_type || !item_detail) {
      return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
    }
  
    const query = `
      INSERT INTO datatable (portion, no, items, item_remind, rank, qa_network, sub_seq, item_seq, item_type, item_detail)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [portion, no, items, item_remind, rank, qa_network, sub_seq, item_seq, item_type, item_detail];
  
    console.log('SQL Query:', query);
    console.log('Values:', values);
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error('Error details:', err.stack);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
      res.status(201).json(result.rows[0]);
    });
  });
  
// Route: อัปเดตข้อมูลใน datatable
app.put('/datatable/:sub_seq/:item_seq', (req, res) => {
  const { sub_seq, item_seq } = req.params;
  const { portion, no, items, item_remind, rank, qa_network, item_type, item_detail } = req.body;

  if (!portion || !no || !items) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }
  const query = `
    UPDATE datatable
    SET portion = $1, no = $2, items = $3, item_remind = $4, rank = $5, qa_network = $6, item_type = $7, item_detail = $8
    WHERE sub_seq = $9 AND item_seq = $10
    RETURNING *;`
  ;
  const values = [portion, no, items, item_remind, rank, qa_network, item_type, item_detail, sub_seq, item_seq];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      res.status(500).send(err);
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการอัปเดต' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});
app.delete('/datatable/:subSeq/:itemSeq', (req, res) => {
  const { subSeq, itemSeq } = req.params;
  const query = 'DELETE FROM datatable WHERE sub_seq = $1 AND item_seq = $2 RETURNING *';
  pool.query(query, [subSeq, itemSeq], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).send('Error deleting item');
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(200).json({ message: 'Item deleted successfully', item: result.rows[0] });
    }
  });
});

// Routes สำหรับ employees
app.get('/employees', (req, res) => {
  pool.query('SELECT * FROM employees', (err, result) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/employees', (req, res) => {
  console.log('POST /employees called with body:', req.body);
  const { username, password, role, name, shift, date, time } = req.body;
  if (!username || !password || !role || !name || !shift || !date || !time) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }
  const query = `
    INSERT INTO employees (username, password, role, name, shift, date, time)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`
  ;
  const values = [username, password, role, name, shift, date, time];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send(err);  // ถ้าพบข้อผิดพลาดในการเพิ่มข้อมูล
    } else {
      console.log('User added:', result.rows[0]);
      res.status(201).json(result.rows[0]);  // ส่งข้อมูลพนักงานที่เพิ่มกลับไป
    }
  });
});

// Route: อัปเดตข้อมูลพนักงาน
app.put('/employees/:username', (req, res) => {
  const { username } = req.params;
  const { password, role, name, shift, date, time } = req.body;
  if (!password || !role || !name || !shift || !date || !time) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }
  const query = `
    UPDATE employees
    SET password = $1, role = $2, name = $3, shift = $4, date = $5, time = $6
    WHERE username = $7
    RETURNING *; `
  ;
  const values = [password, role, name, shift, date, time, username];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send(err); 
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'ไม่พบผู้ใช้ที่ต้องการอัปเดต' }); 
    } else {
      res.status(200).json(result.rows[0]);  
    }
  });
});

app.delete('/employees/:username', (req, res) => {
  const { username } = req.params;
  const query = 'DELETE FROM employees WHERE username = $1 RETURNING *';
  pool.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send(err);
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    }
  });
});



app.post('/employees/login',(req,res)=>{
  const {username,password}=req.body;
  const query = 'SELECT * FROM employees WHERE username = $1 AND password = $2';
  pool.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).send('Internal server error');
    } else if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // ส่งข้อมูลผู้ใช้กลับไปถ้าพบ
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});
app.get('/employees/auth', (req, res) => {
  pool.query('SELECT username, password, role FROM employees', (err, result) => {
    if (err) {
      console.error('Error fetching auth data:', err);
      res.status(500).send(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/datatable', (req, res) => {
  console.log('GET /datatable called');
  
  const query = `
    SELECT * FROM datatable
    ORDER BY CAST(sub_seq AS FLOAT), item_seq;
  `;
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send(err);
    } else {
      res.json(result.rows);  // ส่งข้อมูลทั้งหมดกลับไปยังคลายเอ็นท์
    }
  });
});



app.put('/datatable/status', upload.single('file'), async (req, res) => {
  try {
    const changes = typeof req.body.changes === 'string' 
      ? JSON.parse(req.body.changes) 
      : req.body.changes;

    const shift = req.body.shift;
    const date = req.body.date;

    const uploadedFile = req.file;
    const filePath = uploadedFile ? uploadedFile.filename : null;

    changes.forEach(change => {
      if (change.status === 'NG' && filePath) {
        change.path = filePath;
      }
    });

    const updateQueries = changes.map(change => {
      const { subSeq, itemSeq, status, remark, path } = change;
      return pool.query(
        `UPDATE datatable 
         SET status = $1, remark = $2, path = $3, shift = $4, date = $5
         WHERE sub_seq = $6 AND item_seq = $7`,
        [status, remark || null, path || null, shift, date, subSeq, itemSeq]
      );
    });

    await Promise.all(updateQueries);

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).json({ error: 'Error updating status' });
  }
});






const moment = require('moment-timezone');

app.get('/datatable/shift', async (req, res) => {
  try {
    const currentTime = moment().tz('Asia/Bangkok');
    const hours = currentTime.hours();
    const minutes = currentTime.minutes();

    function getShift(hours, minutes) {
      if (
        (hours > 7 || (hours === 7 && minutes >= 30)) && 
        (hours < 16 || (hours === 16 && minutes < 30))  
      ) {
        return 'AM';
      }
      return 'PM';
    }

    const shift = getShift(hours, minutes);
    // ส่งข้อมูล Shift กลับ
    res.json({ shift });
  } catch (error) {
    console.error('Error determining shift:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const { updateResetTime } = require('./resetTimeConfig');
// API สำหรับตั้งค่าเวลาใหม่
app.post('/reset-time', (req, res) => {
  const { hour, minute } = req.body;

  if (hour === undefined || minute === undefined) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }

  updateResetTime(hour, minute); // บันทึกข้อมูล custom time
  res.status(200).json({ message: 'บันทึกเวลาเรียบร้อย' });
});

// API สำหรับดึงค่า resetTime
app.get('/reset-time', (req, res) => {
  const data = getResetTime();
  res.status(200).json(data);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});