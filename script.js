// 當網頁載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 大圖區背景圖輪播
    const bigImageAreas = document.querySelectorAll('.big-image-area');
    const heroBgImages = [
        'images/體驗大自然的寧靜與美好1.jpg',
        'images/體驗大自然的寧靜與美好2.jpg'
    ];
    let currentBgIndex = 0;
    
    // 背景圖切換函數
    function changeHeroBg() {
        // 使用 fade 效果切換背景
        bigImageAreas.forEach(element => {
            element.style.opacity = 0;
            
            setTimeout(() => {
                currentBgIndex = (currentBgIndex + 1) % heroBgImages.length;
                element.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${heroBgImages[currentBgIndex]}')`;
                element.style.opacity = 1;
            }, 1000);
        });
    }
    
    // 設定 CSS transition 用於淡入淡出效果
    if (bigImageAreas.length > 0) {
        bigImageAreas.forEach(element => {
            element.style.transition = 'opacity 1s ease';
        });
        
        // 每 6 秒切換一次背景
        setInterval(changeHeroBg, 6000);
    }

    // 處理頁面導航圖示
    setupPageIcons();
    
    // 導航欄滾動效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
        }
    });

    // 平滑滾動效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 創建圖片資料夾
    // 注意：這裡只是示意用的代碼，實際上前端JavaScript無法創建伺服器上的資料夾
    // 您需要手動創建images資料夾，或使用後端語言實現

    // 圖片懶加載
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 200px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        }, imgOptions);

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // 不支援 IntersectionObserver 的瀏覽器使用替代方法
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }

    // 簡易的回到頂部按鈕
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.className = 'back-to-top';
        button.style.display = 'none';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '999';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.opacity = '0.7';
        button.style.transition = 'opacity 0.3s ease';
        
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.7';
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    };
    
    createBackToTopButton();
    
    // 簡易表單驗證（用於預訂表單）
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // 創建或更新錯誤消息
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                    errorMsg.textContent = '此欄位為必填';
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.textContent = '';
                    }
                }
            });
            
            // 驗證電子郵件格式
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                    
                    let errorMsg = emailField.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
                    }
                    errorMsg.textContent = '請輸入有效的電子郵件地址';
                }
            }
            
            // 驗證電話號碼格式（基本驗證）
            const phoneField = this.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value.trim()) {
                const phonePattern = /^[\d\s\-\+\(\)]{8,}$/;
                if (!phonePattern.test(phoneField.value)) {
                    isValid = false;
                    phoneField.classList.add('error');
                    
                    let errorMsg = phoneField.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        phoneField.parentNode.insertBefore(errorMsg, phoneField.nextSibling);
                    }
                    errorMsg.textContent = '請輸入有效的電話號碼';
                }
            }
            
            // 如果表單驗證通過，提交或顯示成功消息
            if (isValid) {
                // 在這裡您可以添加AJAX提交表單的代碼
                // 或者重定向到感謝頁面
                const formContainer = document.querySelector('.booking-form-container');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>預訂申請已成功提交！</h3>
                    <p>我們會盡快與您聯繫確認預訂詳情。</p>
                    <p>謝謝您選擇寶山葡萄藤露營區！</p>
                `;
                
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
                
                // 滾動到成功消息
                window.scrollTo({
                    top: formContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
        
        // 清除錯誤提示
        bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.textContent = '';
                }
            });
        });
    }
    
    // 圖片輪播（如果存在）
    const initImageSlider = () => {
        const sliders = document.querySelectorAll('.image-slider');
        sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            let currentSlide = 0;
            
            const showSlide = (n) => {
                slides.forEach(slide => slide.style.display = 'none');
                
                currentSlide = (n + slides.length) % slides.length;
                slides[currentSlide].style.display = 'block';
            };
            
            // 建立導覽按鈕
            const prevButton = document.createElement('button');
            prevButton.className = 'slider-nav prev';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
            
            const nextButton = document.createElement('button');
            nextButton.className = 'slider-nav next';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
            
            slider.appendChild(prevButton);
            slider.appendChild(nextButton);
            
            // 初始顯示第一張圖片
            showSlide(0);
            
            // 自動輪播
            setInterval(() => showSlide(currentSlide + 1), 5000);
        });
    };
    
    initImageSlider();
});

// 處理頁面導航圖示
function setupPageIcons() {
    // 獲取當前頁面的檔名
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 頁面導航圖示信息
    const pageIcons = [
        { page: 'landscape.html', icon: 'fa-mountain', text: '絕美景觀' },
        { page: 'camping-sites.html', icon: 'fa-campground', text: '多樣營位' },
        { page: 'facilities.html', icon: 'fa-shower', text: '完善設施' },
        { page: 'activities.html', icon: 'fa-hiking', text: '豐富活動' }
    ];
    
    // 獲取圖示容器
    const iconsContainer = document.querySelector('.page-icons');
    
    if (iconsContainer) {
        // 清空現有圖示
        iconsContainer.innerHTML = '';
        
        // 添加圖示，但排除當前頁面的圖示
        pageIcons.forEach(iconInfo => {
            if (currentPage !== iconInfo.page) {
                const iconLink = document.createElement('a');
                iconLink.href = iconInfo.page;
                iconLink.className = 'page-icon';
                
                iconLink.innerHTML = `
                    <i class="fas ${iconInfo.icon}"></i>
                    <span class="page-icon-tooltip">${iconInfo.text}</span>
                `;
                
                iconsContainer.appendChild(iconLink);
            }
        });
    }
}