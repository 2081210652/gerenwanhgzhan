/**
 * 创意大师 - 案例相关逻辑
 * 负责: 案例加载、渲染、悬停播放、详情展示
 */

// ============================================
// 案例数据 - 6张展示卡片
// 2个创意盲盒（图片，小卡片）+ 4个视频案例（正常大小）
// ============================================
const casesData = [
    // 创意盲盒 - 有声版（图片，小卡片）
    {
        id: 'case-001',
        title: '创意盲盒-有声版',
        brand: '创意大师',
        brandLogo: '盲',
        followers: '-',
        score: 95,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '../../创意盲盒-use.webp',
        video: '',
        category: 'hot',
        format: 'template',
        isSmall: true,
        isImage: true
    },
    // 创意盲盒 - 无声版（图片，小卡片）
    {
        id: 'case-002',
        title: '创意盲盒',
        brand: '创意大师',
        brandLogo: '盲',
        followers: '-',
        score: 92,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '../../创意盲盒无声版-use.webp',
        video: '',
        category: 'hot',
        format: 'template',
        isSmall: true,
        isImage: true
    },
    // 小人搅拌（视频，正常大小）
    {
        id: 'case-003',
        title: '小人搅拌',
        brand: '创意大师',
        brandLogo: '搅',
        followers: '-',
        score: 88,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '',
        video: '../../小人搅拌-use.mp4',
        category: 'general',
        format: 'product'
    },
    // 涂满奶油（视频，正常大小）
    {
        id: 'case-004',
        title: '涂满奶油',
        brand: '创意大师',
        brandLogo: '奶',
        followers: '-',
        score: 90,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '',
        video: '../../涂满奶油-use.mp4',
        category: 'food',
        format: 'product'
    },
    // 迷你珐斑师（视频，正常大小）
    {
        id: 'case-005',
        title: '迷你珐斑师',
        brand: '创意大师',
        brandLogo: '珐',
        followers: '-',
        score: 87,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '',
        video: '../../迷你珐斑师-use.mp4',
        category: 'beauty',
        format: 'product'
    },
    // 迷你美白专家（视频，正常大小）
    {
        id: 'case-006',
        title: '迷你美白专家',
        brand: '创意大师',
        brandLogo: '白',
        followers: '-',
        score: 89,
        launchDays: '-',
        launchDateRange: '-',
        plays3d: '-',
        playsTotal: '-',
        likes: '-',
        comments: '-',
        saves: '-',
        cover: '',
        video: '../../迷你美白专家-use.mp4',
        category: 'beauty',
        format: 'product'
    }
];

// ============================================
// 加载和渲染案例
// ============================================
function loadCases() {
    renderCases(casesData);
}

function renderCases(cases) {
    const grid = document.getElementById('case-grid');
    if (!grid) return;
    
    grid.innerHTML = cases.map((caseItem, index) => {
        // 判断是图片还是视频
        const isImage = caseItem.isImage || false;
        const isSmall = caseItem.isSmall || false;
        const cardClass = `case-card card-enter${isSmall ? ' case-card-small' : ''}`;
        
        // 媒体区域：图片或视频
        const mediaContent = isImage ? `
            <img class="card-image" src="${caseItem.cover}" alt="${caseItem.title}">
        ` : `
            <video class="card-video" 
                   src="${caseItem.video}" 
                   muted 
                   loop 
                   playsinline
                   preload="metadata"></video>
            <div class="play-btn">▶</div>
        `;
        
        // 简化内容区域（模版卡片不显示详细数据）
        const contentArea = isImage ? `
            <div class="card-content card-content-simple">
                <h3 class="card-title">${caseItem.title}</h3>
                <div class="template-action">
                    <span class="action-text">随机灵感</span>
                    <span class="action-arrow">→</span>
                </div>
            </div>
        ` : `
            <div class="card-content">
                <h3 class="card-title">${caseItem.title}</h3>
            </div>
        `;
        
        return `
        <div class="${cardClass}" 
             data-id="${caseItem.id}"
             data-category="${caseItem.category}"
             data-format="${caseItem.format}"
             data-score="${caseItem.score}"
             data-index="${index}">
            
            <div class="card-media" onclick="${isImage ? '' : `playCaseVideo(${index})`}">
                ${mediaContent}
                ${!isImage ? `
                <div class="score-badge">
                    <span class="score-label">跑量分</span>
                    <span class="score-value">${caseItem.score}</span>
                </div>
                ` : ''}
            </div>
            
            ${contentArea}
        </div>
    `}).join('');
    
    // 绑定悬停播放事件
    bindCaseHoverEvents();
}

// 格式化互动数据
function formatInteraction(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    } else if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

// 解析数字字符串
function parseNumberString(str) {
    if (typeof str === 'number') return str;
    str = str.toString().toLowerCase();
    if (str.includes('w')) {
        return parseFloat(str) * 10000;
    }
    return parseFloat(str.replace(/,/g, '')) || 0;
}

// ============================================
// 悬停播放逻辑
// 视频默认显示第一帧作为封面，悬停时播放
// ============================================
function bindCaseHoverEvents() {
    const cards = document.querySelectorAll('.case-card');
    
    cards.forEach(card => {
        const mediaArea = card.querySelector('.card-media');
        const video = card.querySelector('.card-video');
        
        if (!mediaArea || !video) return;
        
        // 鼠标进入: 从头播放
        mediaArea.addEventListener('mouseenter', () => {
            if (video.src) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }
        });
        
        // 鼠标离开: 暂停并回到第一帧
        mediaArea.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // 回到第一帧作为封面
        });
    });
}

// ============================================
// 案例点击处理
// ============================================
function handleCaseClick(index) {
    const caseItem = casesData[index];
    openCaseModal(caseItem);
}

// 播放案例视频 (全屏播放)
function playCaseVideo(index) {
    const caseItem = casesData[index];
    
    // 也打开详情弹窗，自动播放视频
    openCaseModal(caseItem);
    
    // 延迟播放视频
    setTimeout(() => {
        const videoPlayer = document.getElementById('case-video-player');
        if (videoPlayer) {
            videoPlayer.play().catch(() => {});
        }
    }, 300);
}

// ============================================
// 分析 Tab 切换
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const analysisTabs = document.querySelectorAll('.analysis-tab');
    
    analysisTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            analysisTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            
            // 可以在这里添加不同 Tab 的内容切换逻辑
            if (tabName === 'audience') {
                showToast('受众画像数据加载中...', 'info');
            } else if (tabName === 'related') {
                showToast('关联信息加载中...', 'info');
            }
        });
    });
});

// ============================================
// 从 JSON 文件加载数据 (可选)
// ============================================
async function loadCasesFromJSON() {
    try {
        const response = await fetch('data/cases.json');
        if (response.ok) {
            const data = await response.json();
            renderCases(data);
        }
    } catch (error) {
        console.log('使用内置数据');
        renderCases(casesData);
    }
}

// 导出全局函数
window.loadCases = loadCases;
window.handleCaseClick = handleCaseClick;
window.playCaseVideo = playCaseVideo;
