const fs = require('fs');
const path = require('path');
// กำหนดที่เก็บไฟล์ resetTime
const configPath = path.join(__dirname, 'resetTime.json');  

function getResetTime() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);  
    } else {
      console.warn('[INFO] File not found. Using default reset time.');
      return { hour: 16, minute: 30 }; 
    }
  } catch (error) {
    console.error('[ERROR] Error reading reset time config:', error.message);
    return { hour: 16, minute: 30 };  
  }
}

// ฟังก์ชันบันทึกค่าเวลาไปที่ไฟล์
function updateResetTime(hour, minute) {
  const resetTime = { hour, minute };
  fs.writeFileSync(configPath, JSON.stringify(resetTime, null, 2), 'utf8');
}

module.exports = { getResetTime, updateResetTime };
