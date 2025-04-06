# 寶山葡萄藤露營區管理系統資料目錄

此資料夾包含營區管理系統所需的各種配置文件和範例資料，用於系統初始化和運行時使用。

## 目錄結構

```
data/
├── bookings/           # 預約系統相關資料
│   ├── bookings_config.json  # 預約系統配置
│   └── bookings_sample.json  # 範例預約資料
│
├── campsites/          # 營位管理相關資料
│   ├── campsites_config.json # 營位類型和分區配置
│   └── campsites_list.json   # 詳細營位清單
│
├── customers/          # 客戶管理相關資料
│   ├── customers_config.json # 客戶分類和會員配置
│   └── customer_list.json    # 客戶範例資料
│
├── reports/            # 統計報表相關資料
│   └── reports_config.json   # 報表類型和圖表配置
│
└── system/             # 系統配置相關資料
    └── system_config.json    # 系統用戶、權限和安全配置
```

## 資料檔說明

### 預約系統 (bookings)

- **bookings_config.json**: 包含預約狀態定義、電子郵件模板、預約規則和表單設定
- **bookings_sample.json**: 包含範例預約資料，用於測試和展示

### 營位管理 (campsites)

- **campsites_config.json**: 定義營位類型、區域劃分、價格調整和維護計劃
- **campsites_list.json**: 詳細的營位資訊，包含每個營位的位置、特色、容量和價格

### 客戶管理 (customers)

- **customers_config.json**: 定義客戶分類、偏好選項、聯絡規則和會員忠誠計劃
- **customer_list.json**: 包含範例客戶資料，用於測試和展示

### 統計報表 (reports)

- **reports_config.json**: 定義各類報表類型、可用度量值、圖表配置和匯出格式

### 系統配置 (system)

- **system_config.json**: 包含系統角色、用戶、密碼策略、通知設定、備份策略和安全配置

## 使用說明

- 所有配置文件使用JSON格式，便於閱讀和程式處理
- 數據範例僅供系統初始化和展示使用，實際系統上線後應使用資料庫儲存
- 修改配置文件前請先備份，避免系統運作異常

## 技術說明

- 所有日期格式遵循 ISO 8601 標準 (YYYY-MM-DD)
- 時間戳格式為 ISO 8601 UTC 格式加上時區偏移量 (YYYY-MM-DDTHH:MM:SS+08:00)
- 貨幣金額單位均為新台幣 (TWD)
- 顏色代碼使用十六進制 HEX 格式 (#RRGGBB) 