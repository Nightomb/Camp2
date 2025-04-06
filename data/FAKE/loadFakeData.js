/**
 * 寶山葡萄藤露營區 - 假資料載入器
 *
 * 此模組負責將假資料載入到localStorage中，以模擬後台系統
 * 但在生產環境中不會載入假資料，確保不影響 Google Cloud 資料庫對接
 */

// 環境檢測 - 判斷是否為開發環境
const isDevEnvironment = () => {
  // 檢測網址是否為本地開發環境 (localhost 或 file://)
  const isLocalhost = window.location.hostname === 'localhost' 
                    || window.location.hostname === '127.0.0.1'
                    || window.location.hostname === '';
  
  // 檢測是否有開發環境標記
  const hasDevFlag = localStorage.getItem('devEnvironment') === 'true';
  
  // 檢測網址是否包含開發環境參數
  const hasDevParam = window.location.search.includes('dev=true');
  
  return isLocalhost || hasDevFlag || hasDevParam;
};

// 使用 data- 屬性檢測
const hasDevAttribute = () => {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('data-environment') === 'development';
};

// 要載入的資料檔案
const dataFiles = [
  { key: 'campingBookings', path: '/data/FAKE/bookings.json' },
  { key: 'campsiteCapacity', path: '/data/FAKE/campsite-capacity.json' },
  { key: 'availabilityData', path: '/data/FAKE/availability.json' },
  { key: 'usersData', path: '/data/FAKE/users.json' },
  { key: 'loginLogs', path: '/data/FAKE/login-logs.json' }
];

// 存放載入狀態
let dataLoaded = false;

// 初始化假資料
async function initFakeData() {
  // 如果不是開發環境，不載入假資料
  if (!isDevEnvironment() && !hasDevAttribute()) {
    console.log('檢測到生產環境，不載入假資料');
    // 移除之前可能存在的假資料
    clearFakeData();
    // 設置一個標記表示已檢查過環境
    localStorage.setItem('envChecked', 'true');
    return false;
  }
  
  console.log('正在載入假資料...');

  try {
    // 依序載入所有檔案
    for (const file of dataFiles) {
      const response = await fetch(file.path);

      if (!response.ok) {
        throw new Error(`無法載入 ${file.path}，狀態: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem(file.key, JSON.stringify(data));
      console.log(`已載入假${file.key} 資料`);
    }

    console.log('所有假資料已成功載入');
    dataLoaded = true;
    return true;
  } catch (error) {
    console.error('載入假資料時出錯:', error);
    // 嘗試使用替代方法載入
    try {
      console.log('嘗試使用硬編碼資料...');
      loadHardcodedData();
      console.log('已使用硬編碼資料作為備用');
      dataLoaded = true;
      return true;
    } catch (e) {
      console.error('載入硬編碼資料也失敗:', e);
      return false;
    }
  }
}

// 清除所有假資料
function clearFakeData() {
  const fakeDataKeys = [
    'campingBookings',
    'campsiteCapacity',
    'availabilityData',
    'usersData',
    'loginLogs',
    'adminLoggedIn',
    'campsitePrices'
  ];
  
  fakeDataKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`已移除假資料: ${key}`);
    }
  });
}

// 預設硬編碼資料 (當JSON檔案載入失敗時使用)
function loadHardcodedData() {
  // 僅在開發環境中載入
  if (!isDevEnvironment() && !hasDevAttribute()) {
    console.log('生產環境中，不載入硬編碼假資料');
    return false;
  }
  
  // 營位容量設定
  const campsiteCapacity = {
    "grass": 10,
    "wooden": 8,
    "rv": 5
  };
  
  // 使用者資料
  const usersData = [
    {
      "id": "admin1",
      "username": "admin",
      "password": "88888888",
      "name": "寶山營主",
      "role": "admin",
      "email": "admin@campsite.com",
      "lastLogin": "2023-05-20T08:30:00Z"
    },
    {
      "id": "staff1",
      "username": "staff01",
      "password": "staff123",
      "name": "王小明",
      "role": "staff",
      "email": "staff01@campsite.com",
      "lastLogin": "2023-05-19T14:20:00Z"
    }
  ];
  
  // 登入紀錄
  const loginLogs = [
    {
      "id": "LOG20230520-0830",
      "username": "admin",
      "name": "寶山營主",
      "ip": "192.168.1.100",
      "timestamp": "2023-05-20T08:30:00Z",
      "status": "success",
      "details": "成功登入"
    },
    {
      "id": "LOG20230519-1420",
      "username": "staff01",
      "name": "王小明",
      "ip": "192.168.1.105",
      "timestamp": "2023-05-19T14:20:00Z",
      "status": "success",
      "details": "成功登入"
    }
  ];
  
  // 空白預約資料 - 沒有任何預約
  const campingBookings = [];
  
  // 可用性資料 - 生成三個月的空白可用性資料，所有營位都可用
  const availabilityData = [];
  const today = new Date();
  
  // 生成未來90天的可用性資料
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // 格式化日期為 YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    
    availabilityData.push({
      "date": dateStr,
      "grass": {
        "total": campsiteCapacity.grass,
        "used": 0,
        "available": campsiteCapacity.grass,
        "rate": 1
      },
      "wooden": {
        "total": campsiteCapacity.wooden,
        "used": 0,
        "available": campsiteCapacity.wooden,
        "rate": 1
      },
      "rv": {
        "total": campsiteCapacity.rv,
        "used": 0,
        "available": campsiteCapacity.rv,
        "rate": 1
      },
      "overallRate": 1,
      "status": "available"
    });
  }
  
  // 儲存到 localStorage
  localStorage.setItem('campsiteCapacity', JSON.stringify(campsiteCapacity));
  localStorage.setItem('usersData', JSON.stringify(usersData));
  localStorage.setItem('loginLogs', JSON.stringify(loginLogs));
  localStorage.setItem('campingBookings', JSON.stringify(campingBookings));
  localStorage.setItem('availabilityData', JSON.stringify(availabilityData));
  
  console.log('已生成三個月的空白預約資料，所有營位都可用');
  return true;
}

// 檢查資料是否已經載入
function isDataLoaded() {
  // 如果不是開發環境，則假資料永遠不被視為已載入
  if (!isDevEnvironment() && !hasDevAttribute()) {
    return false;
  }
  return dataLoaded;
}

// 檢查環境並設置標記
function checkEnvironment() {
  const env = isDevEnvironment() || hasDevAttribute() ? 'development' : 'production';
  console.log(`當前環境: ${env}`);
  document.documentElement.setAttribute('data-env-checked', 'true');
  document.documentElement.setAttribute('data-environment', env);
}

// 暴露給全局的模組
window.fakeCampData = {
  init: initFakeData,
  isLoaded: isDataLoaded,
  clearFakeData: clearFakeData,
  checkEnvironment: checkEnvironment,
  setDevEnvironment: () => {
    localStorage.setItem('devEnvironment', 'true');
    return true;
  },
  setProductionEnvironment: () => {
    localStorage.removeItem('devEnvironment');
    clearFakeData();
    return true;
  },
  isDevMode: () => isDevEnvironment() || hasDevAttribute()
};

// 自動初始化（如果尚未載入且在開發環境）
document.addEventListener('DOMContentLoaded', () => {
  // 檢查環境
  checkEnvironment();
  
  if (isDevEnvironment() || hasDevAttribute()) {
    if (!isDataLoaded()) {
      console.log('開發環境：未偵測到假資料，正在自動載入...');
      initFakeData().then(success => {
        if (success) {
          console.log('開發環境：系統準備就緒，已使用假資料庫');
        } else {
          console.error('開發環境：假資料庫載入失敗，系統可能無法正常運作');
        }
      });
    } else {
      console.log('開發環境：偵測到假資料已載入，系統準備就緒');
    }
  } else {
    console.log('生產環境：不載入假資料，使用 Google Cloud 資料庫');
    // 清除任何可能存在的假資料
    clearFakeData();
  }
}); 