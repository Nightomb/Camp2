# 寶山葡萄藤露營區 - 假資料庫

此資料夾包含模擬營地管理系統運行所需的假資料。這些JSON檔案可用於前端開發和測試，無需連接真實資料庫。

## 資料檔案說明

### 1. bookings.json
預約資料，包含半年期間內的模擬預約記錄。

結構說明：
- `id`: 預約編號
- `name`: 客戶姓名
- `phone`: 聯絡電話
- `email`: 電子郵件
- `siteType`: 營位類型 (草地營位、木棧板營位、露營車營位)
- `adults`: 成人人數
- `children`: 兒童人數
- `status`: 狀態 (pending待確認, confirmed已確認, cancelled已取消)
- `checkIn`: 入住日期
- `checkOut`: 退房日期
- `specialRequests`: 特殊需求/備註
- `createdAt`: 建立時間

### 2. campsite-capacity.json
營位容量設定，定義各類型營位的總數。

結構說明：
- `grass`: 草地營位總數
- `wooden`: 木棧板營位總數
- `rv`: 露營車營位總數

### 3. availability.json
營位可用狀態資料，提供半年內每個週末的營位可用情況。

結構說明：
- `date`: 日期
- `status`: 整體狀態 (available可預約, limited僅剩少量, unavailable已滿)
- `availableGrass`: 可用草地營位數量
- `availableWooden`: 可用木棧板營位數量
- `availableRv`: 可用露營車營位數量

### 4. users.json
系統管理員資料。

結構說明：
- `id`: 用戶ID
- `username`: 登入帳號
- `password`: 密碼
- `name`: 使用者姓名
- `email`: 電子郵件
- `role`: 角色 (admin主管理員, staff一般管理員, reception前台人員)
- `lastLogin`: 最後登入時間
- `status`: 帳號狀態

### 5. login-logs.json
系統登入記錄。

結構說明：
- `id`: 記錄ID
- `username`: 帳號
- `name`: 使用者姓名
- `ip`: IP位址
- `timestamp`: 時間戳記
- `status`: 狀態 (success成功, failure失敗)
- `details`: 詳細說明

## 如何使用

在前端開發過程中，可直接引用這些JSON檔案模擬資料操作：

```javascript
// 範例：讀取預約資料
fetch('/data/FAKE/bookings.json')
  .then(response => response.json())
  .then(bookings => {
    console.log('預約資料載入成功:', bookings);
    // 處理預約資料...
  })
  .catch(error => console.error('預約資料載入失敗:', error));
```

開發階段可透過localStorage處理資料修改，實際上線時再轉為從後端讀取資料。 