/**
 * 创意大师 - 主逻辑文件 (对标竞品)
 */

// ============================================
// 全局状态
// ============================================
const AppState = {
    currentMode: 'cases',        // 'templates' | 'cases'
    currentCategory: 'all',
    isLoggedIn: false,
    userPoints: 1264,
    userName: '',
};

// ============================================
// DOM 缓存
// ============================================
const DOM = {
    scrollContainer: document.getElementById('scroll-container'),
    topNav: document.querySelector('.top-nav'),
    
    // Tab 切换
    tabBtns: document.querySelectorAll('.tab-btn'),
    templatesFilters: document.querySelector('.templates-filters'),
    casesFilters: document.querySelector('.cases-filters'),
    templateGrid: document.getElementById('template-grid'),
    caseGrid: document.getElementById('case-grid'),
    
    // 弹窗
    templateModal: document.getElementById('template-modal'),
    caseModal: document.getElementById('case-modal'),
    loginModal: document.getElementById('login-modal'),
    generatingModal: document.getElementById('generating-modal'),
    
    // Toast
    toastContainer: document.getElementById('toast-container'),
};

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffect();
    initVideoCarousel();
    initTabSwitch();
    initFilters();
    initGridScaleControl();
    initEventListeners();
    
    // 默认加载案例
    loadCases();
});

// ============================================
// 滚动效果 - 导航栏背景变化
// ============================================
function initScrollEffect() {
    if (!DOM.scrollContainer || !DOM.topNav) return;
    
    DOM.scrollContainer.addEventListener('scroll', () => {
        const scrollTop = DOM.scrollContainer.scrollTop;
        if (scrollTop > 50) {
            DOM.topNav.classList.add('scrolled');
        } else {
            DOM.topNav.classList.remove('scrolled');
        }
    });
}

// ============================================
// Banner 视频轮播
// ============================================
let carouselIndex = 0;
let carouselInterval = null;
const CAROUSEL_DURATION = 8000;

function initVideoCarousel() {
    const videos = document.querySelectorAll('.banner-video');
    const indicators = document.querySelectorAll('.indicator');
    
    if (videos.length === 0) return;
    
    // 播放第一个视频
    const firstVideo = videos[0];
    firstVideo.play().catch(() => {});
    
    // 自动轮播
    carouselInterval = setInterval(() => {
        switchToVideo((carouselIndex + 1) % videos.length);
    }, CAROUSEL_DURATION);
    
    // 指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(carouselInterval);
            switchToVideo(index);
            carouselInterval = setInterval(() => {
                switchToVideo((carouselIndex + 1) % videos.length);
            }, CAROUSEL_DURATION);
        });
    });
}

function switchToVideo(index) {
    const videos = document.querySelectorAll('.banner-video');
    const indicators = document.querySelectorAll('.indicator');
    
    videos[carouselIndex].pause();
    videos[carouselIndex].classList.remove('active');
    indicators[carouselIndex].classList.remove('active');
    
    carouselIndex = index;
    videos[carouselIndex].currentTime = 0;
    videos[carouselIndex].classList.add('active');
    videos[carouselIndex].play().catch(() => {});
    indicators[carouselIndex].classList.add('active');
}

// ============================================
// Tab 切换
// ============================================
function initTabSwitch() {
    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });
}

function switchMode(mode) {
    AppState.currentMode = mode;
    
    // 更新 Tab 按钮状态
    DOM.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // 切换筛选标签
    if (DOM.templatesFilters && DOM.casesFilters) {
        DOM.templatesFilters.style.display = mode === 'templates' ? 'flex' : 'none';
        DOM.casesFilters.style.display = mode === 'cases' ? 'flex' : 'none';
    }
    
    // 切换卡片网格
    if (DOM.templateGrid && DOM.caseGrid) {
        DOM.templateGrid.style.display = mode === 'templates' ? 'grid' : 'none';
        DOM.caseGrid.style.display = mode === 'cases' ? 'grid' : 'none';
    }
    
    // 加载数据
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
    // 模板筛选
    document.querySelectorAll('.templates-filters .filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.templates-filters .filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            AppState.currentCategory = tag.dataset.category;
            filterTemplates();
        });
    });
    
    // 案例筛选
    document.querySelectorAll('.cases-filters .filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.cases-filters .filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            AppState.currentCategory = tag.dataset.category;
            filterCases();
        });
    });
}

function filterTemplates() {
    const cards = DOM.templateGrid.querySelectorAll('.template-card');
    cards.forEach(card => {
        const category = card.dataset.category;
        const show = AppState.currentCategory === 'all' || category === AppState.currentCategory;
        card.style.display = show ? 'block' : 'none';
    });
}

function filterCases() {
    const cards = DOM.caseGrid.querySelectorAll('.case-card:not(.placeholder-card)');
    cards.forEach(card => {
        const category = card.dataset.category;
        const show = AppState.currentCategory === 'all' || category === AppState.currentCategory;
        card.style.display = show ? 'block' : 'none';
    });
}

// ============================================
// 卡片网格缩放控制 (Ctrl + 滚轮)
// ============================================
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 8;
const DEFAULT_COLUMNS = 5;
let currentColumns = DEFAULT_COLUMNS;

function initGridScaleControl() {
    // Ctrl + 滚轮
    document.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) return;
        
        e.preventDefault();
        
        if (e.deltaY < 0) {
            currentColumns = Math.max(MIN_COLUMNS, currentColumns - 1);
        } else {
            currentColumns = Math.min(MAX_COLUMNS, currentColumns + 1);
        }
        
        updateGridScale();
        showScaleHint();
    }, { passive: false });
    
    // Ctrl + 加号/减号
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
            e.preventDefault();
            currentColumns = Math.max(MIN_COLUMNS, currentColumns - 1);
            updateGridScale();
            showScaleHint();
        } else if (e.ctrlKey && e.key === '-') {
            e.preventDefault();
            currentColumns = Math.min(MAX_COLUMNS, currentColumns + 1);
            updateGridScale();
            showScaleHint();
        }
    });
}

function updateGridScale() {
    const zoom = DEFAULT_COLUMNS / currentColumns;
    const grids = document.querySelectorAll('.card-grid');
    
    grids.forEach(grid => {
        grid.style.setProperty('--columns', currentColumns);
        grid.style.setProperty('--zoom', zoom);
    });
}

let hintTimeout;
function showScaleHint() {
    const hint = document.getElementById('scale-hint');
    if (!hint) return;
    
    const zoom = DEFAULT_COLUMNS / currentColumns;
    const percent = Math.round(zoom * 100);
    hint.textContent = `${currentColumns} 列 · ${percent}%`;
    hint.classList.add('visible');
    
    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
        hint.classList.remove('visible');
    }, 1000);
}

// ============================================
// 事件监听
// ============================================
function initEventListeners() {
    // 登录按钮
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (AppState.isLoggedIn) {
                showToast('已登录: ' + AppState.userName, 'info');
            } else {
                openLoginModal();
            }
        });
    }
    
    // 弹窗背景点击关闭
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
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

// 模板详情
function openTemplateModal(templateData) {
    document.getElementById('modal-template-name').textContent = templateData.name;
    document.getElementById('modal-template-desc').textContent = templateData.description;
    document.getElementById('modal-usage-count').textContent = templateData.usageCount.toLocaleString();
    document.getElementById('modal-cost').textContent = templateData.costPoints;
    
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
    
    resetUploadState();
    openModal(DOM.templateModal);
}

function closeTemplateModal() {
    const previewVideo = document.getElementById('template-preview-video');
    if (previewVideo) previewVideo.pause();
    closeModal(DOM.templateModal);
}

// 案例详情
function openCaseModal(caseData) {
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
    
    const videoPlayer = document.getElementById('case-video-player');
    if (caseData.video) {
        videoPlayer.src = caseData.video;
    }
    
    document.getElementById('video-likes').textContent = caseData.likes.toLocaleString();
    document.getElementById('video-comments').textContent = caseData.comments.toLocaleString();
    document.getElementById('video-saves').textContent = caseData.saves.toLocaleString();
    
    openModal(DOM.caseModal);
}

function closeCaseModal() {
    const videoPlayer = document.getElementById('case-video-player');
    if (videoPlayer) videoPlayer.pause();
    closeModal(DOM.caseModal);
}

// 登录弹窗
function openLoginModal() {
    openModal(DOM.loginModal);
}

function closeLoginModal() {
    closeModal(DOM.loginModal);
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
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function showFeatureToast(featureName) {
    showToast(`"${featureName}" 功能开发中，敬请期待`, 'info');
}

// ============================================
// 导出全局函数
// ============================================
window.openTemplateModal = openTemplateModal;
window.closeTemplateModal = closeTemplateModal;
window.openCaseModal = openCaseModal;
window.closeCaseModal = closeCaseModal;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.showToast = showToast;
window.showFeatureToast = showFeatureToast;
window.updateGridScale = updateGridScale;
