# Google Cloud Platform 部署指南

本文檔提供將露營預約系統部署到Google Cloud Platform (GCP) Compute Engine的完整步驟。

## 準備工作

1. **GCP帳號**：確保您擁有Google Cloud Platform帳號，並已創建一個專案。
2. **gcloud CLI**：安裝並配置Google Cloud CLI工具。
3. **網域名稱**：可選，如需使用自定義域名。

## 部署步驟

### 1. 創建GCP Compute Engine實例

```bash
# 使用gcloud命令創建一個基於Debian的VM實例
gcloud compute instances create camping-website \
  --machine-type=e2-small \
  --zone=asia-east1-b \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --boot-disk-size=10GB \
  --tags=http-server,https-server
```

### 2. 設置防火牆規則

```bash
# 允許HTTP流量
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --target-tags=http-server

# 允許HTTPS流量
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --target-tags=https-server
```

### 3. 連接到VM實例

```bash
gcloud compute ssh camping-website --zone=asia-east1-b
```

### 4. 安裝Web伺服器和相關軟體

```bash
# 更新系統包
sudo apt update
sudo apt upgrade -y

# 安裝Nginx
sudo apt install -y nginx

# 安裝Git
sudo apt install -y git

# 安裝Certbot (用於SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 5. 部署網站代碼

#### 方法1: 使用Git

```bash
# 清空默認Nginx網站
sudo rm -rf /var/www/html/*

# 克隆代碼庫到網站目錄
cd /var/www/html
sudo git clone https://your-repo-url.git .
```

#### 方法2: 直接上傳

```bash
# 本地執行，將文件上傳至VM
gcloud compute scp --recurse ./path/to/local/files camping-website:/tmp/website-files --zone=asia-east1-b

# 在VM內執行，移動文件到網站目錄
sudo mv /tmp/website-files/* /var/www/html/
```

### 6. 設置文件權限

```bash
# 確保Nginx可以訪問網站文件
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### 7. 配置Nginx

```bash
# 編輯Nginx配置文件
sudo nano /etc/nginx/sites-available/default
```

將以下內容添加到配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com; # 或使用VM的公共IP
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 如果將來需要API後端，可添加以下內容
    # location /api/ {
    #     proxy_pass http://localhost:3000/;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
```

### 8. 重啟Nginx

```bash
sudo systemctl restart nginx
```

### 9. 設置SSL (如果有域名)

```bash
sudo certbot --nginx -d your-domain.com
```

按照提示完成SSL設置。

### 10. 測試網站

訪問 `http://VM-IP` 或 `https://your-domain.com` 確認網站是否正常運行。

## 更新網站

當您需要更新網站時，可以使用以下方法：

### 使用Git更新

```bash
cd /var/www/html
sudo git pull origin main
```

### 手動更新

```bash
# 本地執行，上傳更新的文件
gcloud compute scp --recurse ./path/to/updated/files camping-website:/tmp/website-files --zone=asia-east1-b

# 在VM內執行，替換文件
sudo cp -r /tmp/website-files/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

## 數據庫整合 (未來擴展)

如果需要將系統連接到真實數據庫，可以使用Google Cloud SQL：

### 1. 建立Cloud SQL實例

```bash
gcloud sql instances create camping-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=asia-east1
```

### 2. 建立數據庫和用戶

```bash
gcloud sql databases create camping --instance=camping-db
gcloud sql users create camping-user --instance=camping-db --password=your-secure-password
```

### 3. 設置數據庫結構

使用SQL客戶端連接並執行：

```sql
CREATE TABLE campsite_capacity (
  id INT PRIMARY KEY,
  grass INT,
  wooden INT,
  rv INT
);

CREATE TABLE site_prices (
  id INT PRIMARY KEY,
  grass DECIMAL(10,2),
  wooden DECIMAL(10,2),
  rv DECIMAL(10,2),
  weekend_surcharge DECIMAL(10,2),
  extra_person_fee DECIMAL(10,2)
);

CREATE TABLE bookings (
  id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(100),
  check_in DATE,
  check_out DATE,
  nights INT,
  site_type VARCHAR(20),
  adults INT,
  children INT,
  special_requests TEXT,
  booking_date DATE,
  total_price DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. 修改配置

更新 `gcloud-config.js` 將 `dataStorage` 設置為 `'cloud'`。

## 維護和監控

### 設置日誌監控

```bash
# 查看Nginx訪問日誌
sudo tail -f /var/log/nginx/access.log

# 查看Nginx錯誤日誌
sudo tail -f /var/log/nginx/error.log
```

### 設置定期備份

如果使用Cloud SQL，設置自動備份：

```bash
gcloud sql instances patch camping-db --backup-start-time=23:00
```

### 監控VM資源

在Google Cloud Console的監控部分設置資源監控和告警。

## 故障排除

### 網站無法訪問

1. 確認VM實例運行中：`gcloud compute instances describe camping-website --zone=asia-east1-b`
2. 確認Nginx運行中：`sudo systemctl status nginx`
3. 檢查防火牆規則：`gcloud compute firewall-rules list`
4. 檢查Nginx錯誤日誌：`sudo tail -f /var/log/nginx/error.log`

### 數據庫連接問題

1. 確認Cloud SQL實例運行中
2. 檢查連接憑證和IP授權
3. 嘗試使用Cloud SQL代理測試連接

## 其他資源

- [Google Cloud Compute Engine文檔](https://cloud.google.com/compute/docs)
- [Nginx官方文檔](https://nginx.org/en/docs/)
- [Cloud SQL文檔](https://cloud.google.com/sql/docs)
- [Let's Encrypt文檔](https://letsencrypt.org/docs/) 