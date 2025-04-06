#!/bin/bash
# 露營區預約系統部署腳本
# 用於將系統部署到Google Cloud Compute Engine

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 確認函數
confirm() {
  read -r -p "${1} [y/n] " response
  case "$response" in
    [yY][eE][sS]|[yY]) 
      true
      ;;
    *)
      false
      ;;
  esac
}

# 檢查gcloud是否已安裝
check_gcloud() {
  echo -e "${BLUE}檢查 gcloud CLI 是否已安裝...${NC}"
  if command -v gcloud >/dev/null 2>&1; then
    echo -e "${GREEN}gcloud 已安裝，版本:`gcloud --version | head -1`${NC}"
    return 0
  else
    echo -e "${RED}未找到 gcloud CLI。請先安裝 Google Cloud SDK: https://cloud.google.com/sdk/docs/install${NC}"
    return 1
  fi
}

# 設置 GCP 項目
setup_project() {
  echo -e "${BLUE}檢查 GCP 項目...${NC}"
  local PROJECTS=$(gcloud projects list --format="value(projectId)")
  
  if [ -z "$PROJECTS" ]; then
    echo -e "${RED}找不到任何 GCP 項目，請先創建項目${NC}"
    return 1
  fi
  
  echo "可用項目列表:"
  echo "$PROJECTS"
  
  read -r -p "請選擇要使用的項目 ID: " PROJECT_ID
  
  if ! echo "$PROJECTS" | grep -q "$PROJECT_ID"; then
    echo -e "${RED}項目 $PROJECT_ID 不存在${NC}"
    return 1
  fi
  
  gcloud config set project "$PROJECT_ID"
  echo -e "${GREEN}已設置項目: $PROJECT_ID${NC}"
  return 0
}

# 建立 Compute Engine 實例
create_vm() {
  local VM_NAME="camping-website"
  local ZONE="asia-east1-b"
  
  echo -e "${BLUE}正在檢查 VM 實例是否已存在...${NC}"
  if gcloud compute instances describe "$VM_NAME" --zone="$ZONE" >/dev/null 2>&1; then
    echo -e "${YELLOW}VM 實例 $VM_NAME 已存在${NC}"
    if confirm "是否要繼續使用現有實例?"; then
      return 0
    else
      echo -e "${RED}部署已取消${NC}"
      return 1
    fi
  fi
  
  echo -e "${BLUE}創建 Compute Engine 實例...${NC}"
  gcloud compute instances create "$VM_NAME" \
    --machine-type=e2-small \
    --zone="$ZONE" \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --boot-disk-size=10GB \
    --tags=http-server,https-server
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}創建 VM 實例失敗${NC}"
    return 1
  fi
  
  echo -e "${BLUE}設置防火牆規則...${NC}"
  gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --target-tags=http-server
  
  gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --target-tags=https-server
  
  echo -e "${GREEN}VM 實例已創建: $VM_NAME${NC}"
  return 0
}

# 配置 VM (通過 SSH 執行命令)
setup_vm() {
  local VM_NAME="camping-website"
  local ZONE="asia-east1-b"
  
  echo -e "${BLUE}正在為 VM 安裝必要軟體...${NC}"
  
  gcloud compute ssh "$VM_NAME" --zone="$ZONE" --command="sudo apt update && sudo apt install -y nginx git certbot python3-certbot-nginx"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}安裝軟體失敗${NC}"
    return 1
  fi
  
  echo -e "${BLUE}準備部署網站文件...${NC}"
  
  # 使用直接命令複製內容到VM
  gcloud compute ssh "$VM_NAME" --zone="$ZONE" --command="sudo rm -rf /var/www/html/*"
  
  echo -e "${GREEN}VM 已準備就緒${NC}"
  return 0
}

# 上傳網站文件
upload_files() {
  local VM_NAME="camping-website"
  local ZONE="asia-east1-b"
  local TMP_DIR="/tmp/camping-website"
  
  echo -e "${BLUE}準備要上傳的文件...${NC}"
  
  # 將文件打包以進行上傳
  if [ ! -d "./deploy_tmp" ]; then
    mkdir -p ./deploy_tmp
  fi
  
  cp -r booking.html gcloud-config.js script.js ./deploy_tmp/
  
  # 使用 gcloud compute scp 上傳文件
  echo -e "${BLUE}正在上傳文件到 VM...${NC}"
  gcloud compute scp --recurse ./deploy_tmp/* "$VM_NAME":~/website-files --zone="$ZONE"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}文件上傳失敗${NC}"
    return 1
  fi
  
  # 將文件移動到 Nginx 目錄
  echo -e "${BLUE}正在部署文件到網站目錄...${NC}"
  gcloud compute ssh "$VM_NAME" --zone="$ZONE" --command="sudo cp -r ~/website-files/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html/ && sudo chmod -R 755 /var/www/html/"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}文件部署失敗${NC}"
    return 1
  fi
  
  # 清理臨時文件
  rm -rf ./deploy_tmp
  gcloud compute ssh "$VM_NAME" --zone="$ZONE" --command="rm -rf ~/website-files"
  
  echo -e "${GREEN}網站文件已部署${NC}"
  return 0
}

# 配置 Nginx
configure_nginx() {
  local VM_NAME="camping-website"
  local ZONE="asia-east1-b"
  
  echo -e "${BLUE}配置 Nginx...${NC}"
  
  # 獲取 VM 的外部 IP
  local VM_IP=$(gcloud compute instances describe "$VM_NAME" --zone="$ZONE" --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
  
  # 創建 Nginx 配置文件
  cat > ./nginx.conf << EOF
server {
    listen 80;
    server_name $VM_IP;
    root /var/www/html;
    index booking.html index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF
  
  # 上傳配置文件
  gcloud compute scp ./nginx.conf "$VM_NAME":~/nginx.conf --zone="$ZONE"
  gcloud compute ssh "$VM_NAME" --zone="$ZONE" --command="sudo mv ~/nginx.conf /etc/nginx/sites-available/default && sudo systemctl restart nginx"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Nginx 配置失敗${NC}"
    return 1
  fi
  
  # 清理臨時文件
  rm -f ./nginx.conf
  
  echo -e "${GREEN}Nginx 已配置完成${NC}"
  return 0
}

# 完成部署
finalize_deployment() {
  local VM_NAME="camping-website"
  local ZONE="asia-east1-b"
  
  # 獲取 VM 的外部 IP
  local VM_IP=$(gcloud compute instances describe "$VM_NAME" --zone="$ZONE" --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
  
  echo -e "${GREEN}部署完成!${NC}"
  echo -e "${GREEN}=============================================${NC}"
  echo -e "${GREEN}露營區預約系統已部署在以下網址:${NC}"
  echo -e "${GREEN}http://$VM_IP/${NC}"
  echo -e "${GREEN}=============================================${NC}"
  echo -e "${YELLOW}注意: 如需使用域名和 HTTPS，請參考部署指南添加 SSL 證書${NC}"
  
  # 確認是否需要開啟網站
  if confirm "是否要在瀏覽器中開啟網站?"; then
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "http://$VM_IP/"
    elif command -v open >/dev/null 2>&1; then
      open "http://$VM_IP/"
    elif command -v start >/dev/null 2>&1; then
      start "http://$VM_IP/"
    else
      echo -e "${YELLOW}無法自動開啟瀏覽器，請手動訪問: http://$VM_IP/${NC}"
    fi
  fi
}

# 主函數
main() {
  echo -e "${BLUE}====================================================${NC}"
  echo -e "${BLUE}     露營區預約系統 - Google Cloud 部署工具      ${NC}"
  echo -e "${BLUE}====================================================${NC}"
  
  # 檢查 gcloud
  if ! check_gcloud; then
    exit 1
  fi
  
  # 設置項目
  if ! setup_project; then
    exit 1
  fi
  
  # 建立 VM
  if ! create_vm; then
    exit 1
  fi
  
  # 配置 VM
  if ! setup_vm; then
    exit 1
  fi
  
  # 上傳文件
  if ! upload_files; then
    exit 1
  fi
  
  # 配置 Nginx
  if ! configure_nginx; then
    exit 1
  fi
  
  # 完成部署
  finalize_deployment
}

# 執行主函數
main 