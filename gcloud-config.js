/**
 * Google Cloud Platform 配置文件
 * 用於配置與Google Cloud服務的連接
 */

const gcpConfig = {
  // GCP專案ID (請替換成您的專案ID)
  projectId: 'camp-reservation-system',
  
  // 服務區域 (亞洲-台灣)
  region: 'asia-east1',
  
  // API基礎URL (根據您的部署情況調整)
  apiBaseUrl: window.location.hostname === 'localhost' ? 'http://localhost:8080' : '',
  
  // 資料庫類型選擇
  // 開發環境: 'localStorage' (使用瀏覽器localStorage)
  // 生產環境: 'cloud' (使用雲端數據庫)
  dataStorage: 'localStorage',
  
  // 系統狀態
  environment: window.location.hostname === 'localhost' ? 'development' : 'production'
};

// 檢測是否在Google Cloud環境下運行
gcpConfig.isCloudEnvironment = function() {
  return this.environment === 'production';
};

// 使用的數據存儲類型
gcpConfig.useCloudDatabase = function() {
  return this.dataStorage === 'cloud';
};

// 初始化函數
gcpConfig.init = function() {
  console.log(`初始化GCP配置: 環境=${this.environment}, 存儲=${this.dataStorage}`);
  
  // 如果在雲環境中且使用雲數據庫，則嘗試建立連接
  if (this.isCloudEnvironment() && this.useCloudDatabase()) {
    console.log('系統將使用Google Cloud數據庫');
    // 這裡未來可以添加數據庫初始化代碼
  } else {
    console.log('系統將使用瀏覽器本地存儲');
  }
  
  return Promise.resolve(true);
};

// 環境檢測 - 判斷是否為開發環境
const isDevEnvironment = () => {
  // 檢測網址是否為本地開發環境 (localhost 或 file://)
  const isLocalhost = window.location.hostname === 'localhost' 
                    || window.location.hostname === '127.0.0.1'
                    || window.location.hostname === '';
  
  return isLocalhost;
};

// 安全地從 localStorage 獲取資料的函數
const safeGetFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    return JSON.parse(value);
  } catch (error) {
    console.error(`讀取 localStorage 鍵 ${key} 時出錯:`, error);
    return defaultValue;
  }
};

// API 請求工具
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    // 在開發環境中使用localStorage，生產環境用API
    if (isDevEnvironment()) {
      return await simulateApiRequest(endpoint, method, data);
    }
    
    // 生產環境使用實際API
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const options = {
      method,
      headers,
      credentials: 'include',
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${gcpConfig.apiBaseUrl}/${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '請求失敗');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 請求失敗:', error);
    throw error;
  }
};

// 模擬 API 請求 (開發環境中使用)
const simulateApiRequest = async (endpoint, method, data) => {
  console.log(`模擬 API 請求: ${method} ${endpoint}`);
  
  // 根據端點模擬不同的 API 行為
  if (endpoint === 'bookings' && method === 'GET') {
    // 模擬獲取預訂列表
    return safeGetFromStorage('campingBookings', []);
  } else if (endpoint === 'bookings' && method === 'POST') {
    // 模擬創建新預訂
    const bookings = safeGetFromStorage('campingBookings', []);
    // 生成唯一 ID
    const now = new Date();
    const bookingId = `BK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newBooking = {
      ...data,
      id: bookingId,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem('campingBookings', JSON.stringify(bookings));
    
    return { id: bookingId, ...newBooking };
  } else if (endpoint === 'settings/capacity' && method === 'GET') {
    // 模擬獲取容量設置
    return safeGetFromStorage('campsiteCapacity', { grass: 15, wooden: 10, rv: 5 });
  } else if (endpoint === 'settings/capacity' && method === 'PUT') {
    // 模擬更新容量設置
    localStorage.setItem('campsiteCapacity', JSON.stringify(data));
    return { success: true };
  }
  
  // 預設返回空數據
  console.warn(`未實現的模擬 API 端點: ${method} ${endpoint}`);
  return {};
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化GCP配置
  gcpConfig.init();
});

// 導出對象供其他模塊使用
window.gcpConfig = gcpConfig; 