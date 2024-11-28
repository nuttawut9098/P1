const axios = require('axios');
const client = require('./db');
const moment = require('moment-timezone');
const { getResetTime, updateResetTime } = require('./resetTimeConfig'); // นำเข้าไฟล์ config

// ตัวแปรเก็บ shift ปัจจุบัน
let currentShift = null;

// ฟังก์ชันเปลี่ยน shift
async function changeShift(shift) {
  try {
    if (shift === currentShift) {
      console.log('Shift is the same. No action needed.');
      return;
    }

    console.log(`Shift changed from "${currentShift}" to "${shift}"`);

    const dataCountResult = await client.query(
      `SELECT COUNT(*) 
       FROM datatable 
       WHERE status IS NOT NULL 
       AND shift IS NOT NULL 
       AND date IS NOT NULL`
    );
    const dataCount = parseInt(dataCountResult.rows[0].count, 10);

    if (dataCount === 0) {
      console.log('No valid data in datatable to process.');
      return;
    }

    const insertResult = await client.query(
      `INSERT INTO data_logs (portion, no, items, item_remind, rank, qa_network, sub_seq, item_seq, item_type, item_detail, status, shift, date)
       SELECT portion, no, items, item_remind, rank, qa_network, sub_seq, item_seq, item_type, item_detail, status, shift, date
       FROM datatable
       WHERE status IS NOT NULL
       AND shift IS NOT NULL
       AND date IS NOT NULL`
    );
    console.log(`Rows inserted into data_logs: ${insertResult.rowCount}`);

    const updateResult = await client.query(
      `UPDATE datatable
       SET status = NULL, date = NULL, shift = NULL
       WHERE status IS NOT NULL
       AND shift IS NOT NULL
       AND date IS NOT NULL`
    );
    console.log(`Rows updated in datatable: ${updateResult.rowCount}`);

    currentShift = shift;

  } catch (error) {
    console.error('Error in changeShift:', error.message);
    throw error;
  }
}


function getScheduledResetTime() {
  const resetTime = getResetTime(); 
  const { hour, minute } = resetTime;
  return { hour, minute };
}

async function checkShiftFromAPI() {
  try {
    const response = await axios.get('http://localhost:3000/datatable/shift');
    const shift = response.data.shift;

    if (shift) {
      console.log(`Received new shift: ${shift}`);
      await changeShift(shift);
    }
  } catch (error) {
    console.error('Error getting shift from API:', error.message);
  }
}

function scheduleShiftCheck() {
  const now = moment().tz('Asia/Bangkok');
  let nextCheckTime;

  const { hour, minute } = getScheduledResetTime(); 

  console.log(`Current time: ${now.format('YYYY-MM-DD HH:mm:ss')}`);

  if (now.hours() < hour || (now.hours() === hour && now.minutes() < minute)) {
    nextCheckTime = moment().tz('Asia/Bangkok').set({ hour, minute, second: 0, millisecond: 0 });
  } else {
    nextCheckTime = moment().tz('Asia/Bangkok').set({ hour, minute, second: 0, millisecond: 0 }).add(1, 'days');
  }

  const timeToNextCheck = Math.max(1000, nextCheckTime.diff(now));

  if (timeToNextCheck <= 0) {
    console.warn(`Time to next check was negative: ${timeToNextCheck}. Adjusting to minimum delay of 1 second.`);
    timeToNextCheck = 1000;
  }

  const hours = Math.floor(timeToNextCheck / (1000 * 60 * 60));
  const minutes = Math.floor((timeToNextCheck % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeToNextCheck % (1000 * 60)) / 1000);
  console.log(`Time remaining for next check: ${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`);
  console.log(`Next check will occur at: ${nextCheckTime.format('YYYY-MM-DD HH:mm:ss')}`);
  setTimeout(() => {
    checkShiftFromAPI();
    scheduleShiftCheck();
  }, timeToNextCheck);
}
async function performResetCheck() {
  const { startTime, resetTimes, updatedAt } = getResetTime();
  const now = moment().tz('Asia/Bangkok').startOf('day');
  const lastUpdated = moment(updatedAt).tz('Asia/Bangkok').startOf('day');

  if (lastUpdated.isSame(now) && startTime) {
    console.log(`Performing custom reset for today at ${startTime.hour}:${startTime.minute}`);
    await resetDataForStartTime(startTime);
  } else {
    console.log(`Performing default resets at: ${resetTimes.map(rt => `${rt.hour}:${rt.minute}`).join(', ')}`);
    for (let resetTime of resetTimes) {
      await resetDataForStartTime(resetTime);
    }
  }

  async function resetDataForStartTime(time) {
    const timeString = moment().tz('Asia/Bangkok').set({ hour: time.hour, minute: time.minute }).format('YYYY-MM-DD HH:mm:ss');
    try {
      console.log(`Resetting data for time: ${timeString}`);
      await client.query(`
        UPDATE datatable
        SET status = NULL, date = NULL, shift = NULL
        WHERE date = $1
      `, [timeString]); 
      console.log(`Data reset complete for ${timeString}`);
    } catch (error) {
      console.error('Error resetting data:', error.message);
    }
  }
}

scheduleShiftCheck(); 
