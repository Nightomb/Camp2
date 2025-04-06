# 寶山葡萄藤露營區網站

這是一個完整的露營區預訂系統，包含前台預訂界面和後台管理功能。系統使用Firebase作為後端數據存儲和身份驗證服務。

## 功能特點

- 前台
  - 響應式設計，適配桌面和移動設備
  - 互動式營位預約日曆
  - 在線預訂表單
  - 即時顯示營位可用狀態

- 後台
  - 安全的管理員登入
  - 預訂管理（確認/取消預訂）
  - 客戶資料管理
  - 營位容量設定
  - 營運數據統計

## 系統設置

### 步驟 1: 創建Firebase帳號和專案

1. 前往 [Firebase 控制台](https://console.firebase.google.com/)
2. 點擊「新增專案」按鈕
3. 輸入專案名稱（例如：baoshancamp）
4. 可選：啟用 Google Analytics
5. 點擊「建立專案」

### 步驟 2: 設定 Firebase 網頁應用

1. 在 Firebase 專案控制台，點擊「網頁」圖標（`</>`）
2. 輸入應用程式暱稱（例如：baoshan-camping-website）
3. 選擇「也設定 Firebase 託管」選項
4. 點擊「註冊應用程式」
5. 保存顯示的 Firebase 配置信息（稍後需要）

### 步驟 3: 設定身份驗證

1. 在側邊欄點擊「Authentication」
2. 點擊「開始使用」
3. 選擇「電子郵件/密碼」提供者
4. 將「電子郵件/密碼」切換為「啟用」
5. 點擊「儲存」

### 步驟 4: 設定 Firestore 數據庫

1. 在側邊欄點擊「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「測試模式」（注意：在實際部署前應更改為安全規則）
4. 選擇離您最近的地區
5. 點擊「啟用」

### 步驟 5: 準備並上傳網站文件

1. 下載或克隆此代碼庫
2. 確保所有必要的文件都存在：
   - HTML 文件（index.html, booking.html, admin.html, setup.html 等）
   - CSS 文件（styles.css）
   - JavaScript 文件（script.js）
   - 圖片文件夾（images/）

### 步驟 6: 初始化系統

1. 在本地或服務器上啟動網站
2. 訪問 `setup.html` 頁面
3. 填寫 Firebase 配置信息（從步驟 2 獲取）
4. 創建管理員帳號
5. 等待系統初始化完成

## 本地運行

您可以使用任何網頁伺服器本地運行此網站，例如：

### 使用 Python 簡易伺服器：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然後訪問 `http://localhost:8000/`

### 使用 Node.js 伺服器：

1. 安裝 http-server
```bash
npm install -g http-server
```

2. 運行伺服器
```bash
http-server -p 8000
```

然後訪問 `http://localhost:8000/`

## 部署到 Firebase Hosting

如果您想要將網站部署到 Firebase Hosting，請執行以下步驟：

1. 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

2. 登入 Firebase
```bash
firebase login
```

3. 初始化專案
```bash
firebase init
```
選擇 Hosting 選項，並選擇您之前創建的專案。
設置公共資料夾為 `.`（當前目錄）。

4. 部署網站
```bash
firebase deploy
```

部署完成後，您將獲得一個形如 `https://yourproject.web.app` 的 URL。

## 重要文件說明

- `firebase-config.js` - Firebase 配置和主要功能
- `admin.html` - 後台管理系統
- `booking.html` - 前台預訂頁面
- `setup.html` - 系統初始化頁面

## 注意事項

- 此系統使用 Firebase 免費套餐，對於小型露營區足夠使用
- 如果預期流量較大，請考慮升級到付費方案
- 在實際部署前，請務必更改 Firestore 安全規則
- 確保管理員密碼足夠強大且妥善保管

## 網站內容

- 首頁：展示營區概況、最新消息和貼心提醒
- 營位介紹：詳細介紹各種營位類型及價格
- 設施服務：營區內的各種設施和服務
- 豐富活動：可參與的各類戶外活動
- 絕美景觀：營區美景相簿展示
- 線上預訂：預訂營位的表單系統
- 管理後臺：管理預訂記錄（需登入）

## 部署到GitHub Pages

1. 創建一個GitHub帳號（如果尚未有）
2. 創建一個新的Repository（例如：camping-website）
3. 使用git命令或GitHub Desktop應用將所有檔案上傳到Repository中：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用戶名/camping-website.git
git push -u origin main
```

4. 在Repository設定中，找到"Pages"選項
5. 在Source下拉選單中選擇"main"分支，然後點擊"Save"
6. 等待幾分鐘後，您的網站將可透過以下網址訪問：
   https://你的用戶名.github.io/camping-website/

## 技術說明

- 網站使用純HTML、CSS和JavaScript構建
- 響應式設計，適應不同裝置
- 本地存儲(localStorage)實現預訂系統
- 支援照片瀏覽和相簿功能

## 後臺登入資訊

系統有以下管理員帳號可用：

- 帳號：admin
- 密碼：88888888

您也可以使用在 setup.html 設定頁面中創建的管理員帳號（電子郵件地址和密碼）來登入。

## 聯絡資訊

寶山葡萄藤露營區
地址：新竹市寶山
電話：(02) 2663-XXXX 