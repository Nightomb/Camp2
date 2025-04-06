const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// 啟用 CORS
app.use(cors());

// 處理 JSON 資料
app.use(express.json());

// 設定靜態檔案目錄
app.use(express.static(path.join(__dirname, './')));

// API 路由 - 示例端點
app.get('/api/hello', (req, res) => {
  res.json({ message: '您好！這是一個示例 API 端點。' });
});

// 預訂 API 模擬端點
app.get('/api/bookings', (req, res) => {
  // 在沒有實際資料庫連接時，返回模擬資料
  res.json([
    { 
      id: 'booking1', 
      name: '測試預訂', 
      status: 'confirmed',
      checkIn: '2023-05-15',
      checkOut: '2023-05-18',
      siteType: 'grass'
    }
  ]);
});

// 捕獲所有其他路由，提供 SPA 體驗
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 啟動伺服器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`伺服器運行於: http://localhost:${PORT}`);
  console.log('環境: ' + process.env.NODE_ENV);
}); 