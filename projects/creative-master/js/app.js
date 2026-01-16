/**
 * 创意大师 - 主逻辑文件
 * 负责: 初始化、模式切换、筛选、Toast、通用工具函数
 */

// ============================================
// 全局状态管理
// ============================================
const AppState = {
    currentMode: 'cases',        // 当前模式: 'templates' | 'cases'
    currentCategory: 'all',      // 当前分类
    currentFormat: 'all',        // 当前素材形式
    isLoggedIn: false,           // 登录状态
    userPoints: 1264,            // 用户点数
    userName: '',                // 用户名
};

// ============================================
// DOM 元素缓存
// ============================================
const DOM = {
    // 模式切换
    modeTemplates: document.getElementById('mode-templates'),
    modeCases: document.getElementById('mode-cases'),
    templatesSection: document.getElementById('templates-section'),
    casesSection: document.getElementById('cases-section'),
    
    // 网格容器
    templateGrid: document.getElementById('template-grid'),
    caseGrid: document.getElementById('case-grid'),
    
    // 弹窗
    templateModal: document.getElementById('template-modal'),
    caseModal: document.getElementById('case-modal'),
    loginModal: document.getElementById('login-modal'),
    rechargeModal: document.getElementById('recharge-modal'),
    generatingModal: document.getElementById('generating-modal'),
    
    // 用户信息
    userPoints: document.getElementById('user-points'),
    userAvatarBtn: document.getElementById('user-avatar-btn'),
    pointsBtn: document.getElementById('points-btn'),
    
    // Toast 容器
    toastContainer: document.getElementById('toast-container'),
};

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initVideoCarousel();  // 初始化 Banner 视频轮播
    initModeSwitch();
    initFilters();
    initUserState();
    initEventListeners();
    
    // 默认加载案例数据
    loadCases();
});

// ============================================
// Banner 视频轮播
// ============================================
let carouselIndex = 0;
let carouselInterval = null;
const CAROUSEL_DURATION = 8000; // 每个视频播放 8 秒后切换

function initVideoCarousel() {
    const videos = document.querySelectorAll('.banner-video');
    const indicators = document.querySelectorAll('.indicator');
    
    if (videos.length === 0) return;
    
    // 播放第一个视频
    videos[0].play().catch(() => {});
    
    // 自动轮播
    carouselInterval = setInterval(() => {
        switchToVideo((carouselIndex + 1) % videos.length);
    }, CAROUSEL_DURATION);
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(carouselInterval);
            switchToVideo(index);
            // 重新开始自动轮播
            carouselInterval = setInterval(() => {
                switchToVideo((carouselIndex + 1) % videos.length);
            }, CAROUSEL_DURATION);
        });
    });
    
    // 视频播放结束时切换到下一个
    videos.forEach((video, index) => {
        video.addEventListener('ended', () => {
            switchToVideo((index + 1) % videos.length);
        });
    });
}

function switchToVideo(index) {
    const videos = document.querySelectorAll('.banner-video');
    const indicators = document.querySelectorAll('.indicator');
    
    // 暂停当前视频
    videos[carouselIndex].pause();
    videos[carouselIndex].classList.remove('active');
    indicators[carouselIndex].classList.remove('active');
    
    // 播放新视频
    carouselIndex = index;
    videos[carouselIndex].currentTime = 0;
    videos[carouselIndex].classList.add('active');
    videos[carouselIndex].play().catch(() => {});
    indicators[carouselIndex].classList.add('active');
}

// ============================================
// 模式切换逻辑
// ============================================
function initModeSwitch() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });
}

function switchMode(mode) {
    AppState.currentMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // 切换内容区域
    DOM.templatesSection.style.display = mode === 'templates' ? 'block' : 'none';
    DOM.casesSection.style.display = mode === 'cases' ? 'block' : 'none';
    
    // 加载对应数据
    if (mode === 'templates') {
        loadTemplates();
    } else {
        loadCases();
    }
}

// ============================================
// 筛选逻辑
// ============================================
function initFilters() {
    // 模板品类筛选
    const templateFilters = document.querySelectorAll('#template-filters .filter-item');
    templateFilters.forEach(item => {
        item.addEventListener('click', () => {
            templateFilters.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            AppState.currentCategory = item.dataset.category;
            filterTemplates();
        });
    });
    
    // 案例品类筛选
    const categoryFilters = document.querySelectorAll('#category-filters .filter-item');
    categoryFilters.forEach(item => {
        item.addEventListener('click', () => {
            categoryFilters.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            AppState.currentCategory = item.dataset.category;
            filterCases();
        });
    });
    
    // 案例素材形式筛选
    const formatFilters = document.querySelectorAll('#format-filters .filter-item');
    formatFilters.forEach(item => {
        item.addEventListener('click', () => {
            formatFilters.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            AppState.currentFormat = item.dataset.format;
            filterCases();
        });
    });
    
    // 排序选择
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortCases(sortSelect.value);
        });
    }
    
    // Tab 切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // 可以在这里添加 Tab 切换逻辑
        });
    });
}

function filterTemplates() {
    // 前端过滤模板
    const cards = DOM.templateGrid.querySelectorAll('.template-card');
    cards.forEach(card => {
        const category = card.dataset.category;
        const show = AppState.currentCategory === 'all' || category === AppState.currentCategory;
        card.style.display = show ? 'block' : 'none';
    });
}

function filterCases() {
    // 前端过滤案例
    const cards = DOM.caseGrid.querySelectorAll('.case-card');
    cards.forEach(card => {
        const category = card.dataset.category;
        const format = card.dataset.format;
        
        const categoryMatch = AppState.currentCategory === 'all' || category === AppState.currentCategory;
        const formatMatch = AppState.currentFormat === 'all' || format === AppState.currentFormat;
        
        card.style.display = (categoryMatch && formatMatch) ? 'block' : 'none';
    });
}

function sortCases(sortBy) {
    const cards = Array.from(DOM.caseGrid.querySelectorAll('.case-card'));
    
    cards.sort((a, b) => {
        const aVal = parseFloat(a.dataset[sortBy]) || 0;
        const bVal = parseFloat(b.dataset[sortBy]) || 0;
        return bVal - aVal; // 降序
    });
    
    // 重新插入排序后的卡片
    cards.forEach(card => DOM.caseGrid.appendChild(card));
}

// ============================================
// 用户状态
// ============================================
function initUserState() {
    // 从 localStorage 读取用户状态
    const savedUser = localStorage.getItem('creativemaster_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        AppState.userName = user.name;
        AppState.userPoints = user.points || 1264;
        updateUserUI();
    }
}

function updateUserUI() {
    // 更新点数显示
    if (DOM.userPoints) {
        DOM.userPoints.textContent = AppState.userPoints.toLocaleString();
    }
    
    // 更新充值弹窗中的点数
    const rechargePoints = document.getElementById('recharge-current-points');
    if (rechargePoints) {
        rechargePoints.textContent = AppState.userPoints.toLocaleString();
    }
}

// ============================================
// 事件监听
// ============================================
function initEventListeners() {
    // 用户头像点击 - 打开登录弹窗
    if (DOM.userAvatarBtn) {
        DOM.userAvatarBtn.addEventListener('click', () => {
            if (AppState.isLoggedIn) {
                // 已登录，显示用户菜单 (可扩展)
                showToast('已登录为: ' + AppState.userName, 'info');
            } else {
                openLoginModal();
            }
        });
    }
    
    // 点数按钮点击 - 打开充值弹窗
    if (DOM.pointsBtn) {
        DOM.pointsBtn.addEventListener('click', openRechargeModal);
    }
    
    // 点击弹窗背景关闭
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // ESC 键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // 充值套餐选择
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            packageCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
    
    // 充值按钮
    const rechargeSubmitBtn = document.getElementById('recharge-submit-btn');
    if (rechargeSubmitBtn) {
        rechargeSubmitBtn.addEventListener('click', () => {
            showToast('支付接口对接中，敬请期待', 'warning');
        });
    }
}

// ============================================
// 弹窗控制
// ============================================
function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// 模板详情弹窗
function openTemplateModal(templateData) {
    // 填充数据
    document.getElementById('modal-template-name').textContent = templateData.name;
    document.getElementById('modal-template-desc').textContent = templateData.description;
    document.getElementById('modal-usage-count').textContent = templateData.usageCount.toLocaleString();
    document.getElementById('modal-cost').textContent = templateData.costPoints;
    
    // 设置预览视频
    const previewVideo = document.getElementById('template-preview-video');
    const previewCover = document.getElementById('template-preview-cover');
    
    if (templateData.video) {
        previewVideo.src = templateData.video;
        previewVideo.style.display = 'block';
        previewCover.style.display = 'none';
        previewVideo.play();
    } else {
        previewVideo.style.display = 'none';
        previewCover.src = templateData.cover;
        previewCover.style.display = 'block';
    }
    
    // 重置上传状态
    resetUploadState();
    
    openModal(DOM.templateModal);
}

function closeTemplateModal() {
    const previewVideo = document.getElementById('template-preview-video');
    if (previewVideo) {
        previewVideo.pause();
    }
    closeModal(DOM.templateModal);
}

// 案例详情弹窗
function openCaseModal(caseData) {
    // 填充数据
    document.getElementById('modal-case-title').textContent = caseData.title;
    document.getElementById('case-score').textContent = caseData.score;
    document.getElementById('case-days').textContent = caseData.launchDays + '天';
    document.getElementById('case-plays-3d').textContent = caseData.plays3d;
    document.getElementById('case-plays-total').textContent = caseData.playsTotal;
    document.getElementById('case-likes').textContent = caseData.likes.toLocaleString();
    document.getElementById('case-comments').textContent = caseData.comments.toLocaleString();
    document.getElementById('case-saves').textContent = caseData.saves.toLocaleString();
    document.getElementById('case-author-link').textContent = caseData.brand;
    document.getElementById('video-author').textContent = caseData.brand;
    
    // 设置视频
    const videoPlayer = document.getElementById('case-video-player');
    if (caseData.video) {
        videoPlayer.src = caseData.video;
    }
    
    // 设置互动数据
    document.getElementById('video-likes').textContent = caseData.likes.toLocaleString();
    document.getElementById('video-comments').textContent = caseData.comments.toLocaleString();
    document.getElementById('video-saves').textContent = caseData.saves.toLocaleString();
    
    openModal(DOM.caseModal);
}

function closeCaseModal() {
    const videoPlayer = document.getElementById('case-video-player');
    if (videoPlayer) {
        videoPlayer.pause();
    }
    closeModal(DOM.caseModal);
}

// 登录弹窗
function openLoginModal() {
    openModal(DOM.loginModal);
}

function closeLoginModal() {
    closeModal(DOM.loginModal);
}

// 充值弹窗
function openRechargeModal() {
    openModal(DOM.rechargeModal);
}

function closeRechargeModal() {
    closeModal(DOM.rechargeModal);
}

// ============================================
// Toast 提示
// ============================================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// AI 功能点击提示
function showFeatureToast(featureName) {
    showToast(`"${featureName}" 功能开发中，敬请期待`, 'info');
}

// ============================================
// 工具函数
// ============================================

// 格式化数字 (1000 -> 1k, 10000 -> 1w)
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 解析数字字符串 (1.2w -> 12000)
function parseNumberString(str) {
    if (typeof str === 'number') return str;
    str = str.toString().toLowerCase();
    if (str.includes('w')) {
        return parseFloat(str) * 10000;
    } else if (str.includes('k')) {
        return parseFloat(str) * 1000;
    }
    return parseFloat(str.replace(/,/g, '')) || 0;
}

// 防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// 导出全局函数 (供 HTML onclick 使用)
// ============================================
window.openTemplateModal = openTemplateModal;
window.closeTemplateModal = closeTemplateModal;
window.openCaseModal = openCaseModal;
window.closeCaseModal = closeCaseModal;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openRechargeModal = openRechargeModal;
window.closeRechargeModal = closeRechargeModal;
window.showToast = showToast;
window.showFeatureToast = showFeatureToast;
