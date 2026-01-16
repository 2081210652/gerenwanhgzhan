/**
 * 创意大师 - 案例相关逻辑
 * 负责: 案例加载、渲染、悬停播放、详情展示
 */

// ============================================
// 案例数据 (可替换为 fetch 从 JSON 加载)
// 📌 重要：请手动重命名视频文件！
//    原文件名含有特殊字符无法正常加载
//    请将视频按时间顺序重命名为：
//    - case-1.mp4 (最早下载的)
//    - case-2.mp4
//    - case-3.mp4
//    - case-4.mp4
//    - case-5.mp4
//    然后放在项目根目录 F:\project-cursor\zuopinji\
// ============================================
const casesData = [
    {
        id: 'case-001',
        title: '跃马迎春，驭时新生，娇韵诗「黄金双萃」马年限定，与您一同开启焕彩新程！',
        brand: 'Clarins娇韵诗',
        brandLogo: 'C',
        followers: '304.9w',
        score: 90,
        launchDays: 2,
        launchDateRange: '25/12/17-25/12/11',
        plays3d: '338.5w',
        playsTotal: '1,032.8w',
        likes: 6190,
        comments: 130,
        saves: 556,
        cover: 'assets/cases/case-001/cover.jpg',
        video: '../../case-1.mp4',  // 请手动重命名
        category: 'beauty',
        format: 'product'
    },
    {
        id: 'case-002',
        title: '这种气血充盈的美随便一涂不就来了吗 #口红试色...',
        brand: '欧莱雅OULAJIA官方旗舰店',
        brandLogo: '欧',
        followers: '78.4w',
        score: 82,
        launchDays: 24,
        launchDateRange: '24/12/01-24/12/25',
        plays3d: '42.3w',
        playsTotal: '290.3w',
        likes: 4838,
        comments: 145,
        saves: 2630,
        cover: 'assets/cases/case-002/cover.jpg',
        video: '../../case-2.mp4',  // 请手动重命名
        category: 'beauty',
        format: 'product'
    },
    {
        id: 'case-003',
        title: '熬夜数据把它推荐 #毛乳头头发多头皮脱的...',
        brand: '大云白云山甄生活旗舰店',
        brandLogo: '云',
        followers: '111.2w',
        score: 81,
        launchDays: 6,
        launchDateRange: '25/01/05-25/01/11',
        plays3d: '12.3w',
        playsTotal: '146.8w',
        likes: 1832,
        comments: 53,
        saves: 427,
        cover: 'assets/cases/case-003/cover.jpg',
        video: '../../case-3.mp4',  // 请手动重命名
        category: 'beauty',
        format: 'single'
    },
    {
        id: 'case-004',
        title: '你们都多久没洗羽绒服了 有了这个 #羽绒服蓬...',
        brand: '水卫士家居生活旗舰店',
        brandLogo: '水',
        followers: '32w',
        score: 59,
        launchDays: 37,
        launchDateRange: '24/11/20-24/12/27',
        plays3d: '3,528',
        playsTotal: '44.6w',
        likes: 425,
        comments: 5,
        saves: 227,
        cover: 'assets/cases/case-004/cover.jpg',
        video: '../../case-4.mp4',  // 请手动重命名
        category: 'home',
        format: 'product'
    },
    {
        id: 'case-005',
        title: '白发困扰不再有！魔法美发棒，轻松遮盖，自然...',
        brand: '魔发美妆小叶精品店',
        brandLogo: '魔',
        followers: '32.8w',
        score: 73,
        launchDays: 7,
        launchDateRange: '25/01/04-25/01/11',
        plays3d: '48.6w',
        playsTotal: '83w',
        likes: 437,
        comments: 4,
        saves: 274,
        cover: 'assets/cases/case-005/cover.jpg',
        video: '../../case-5.mp4',  // 请手动重命名
        category: 'beauty',
        format: 'single'
    },
    {
        id: 'case-006',
        title: '全体注意！这不是广子，是行走的种机！亲...',
        brand: '苏宁官方旗舰店',
        brandLogo: '苏',
        followers: '1,290.1w',
        score: 73,
        launchDays: 7,
        launchDateRange: '25/01/04-25/01/11',
        plays3d: '4.1w',
        playsTotal: '75.4w',
        likes: 835,
        comments: 29,
        saves: 268,
        cover: 'assets/cases/case-006/cover.jpg',
        video: 'assets/cases/case-006/video.mp4',
        category: 'comprehensive',
        format: 'multi'
    },
    {
        id: 'case-007',
        title: '天凉了，羽绒服湿巾可要备起来了，有了...',
        brand: '德佑家居清洁旗舰店直播间',
        brandLogo: '德',
        followers: '29.5w',
        score: 89,
        launchDays: 18,
        launchDateRange: '24/12/20-25/01/07',
        plays3d: '14.3w',
        playsTotal: '921.1w',
        likes: 11000,
        comments: 2300,
        saves: 4279,
        cover: 'assets/cases/case-007/cover.jpg',
        video: 'assets/cases/case-007/video.mp4',
        category: 'home',
        format: 'product'
    },
    {
        id: 'case-008',
        title: '韩束新号开播，9.9元洁面炸不停',
        brand: '韩束尾品会',
        brandLogo: '韩',
        followers: '19w',
        score: 81,
        launchDays: 5,
        launchDateRange: '25/01/06-25/01/11',
        plays3d: '32',
        playsTotal: '205.7w',
        likes: 3798,
        comments: 318,
        saves: 1374,
        cover: 'assets/cases/case-008/cover.jpg',
        video: 'assets/cases/case-008/video.mp4',
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
    
    grid.innerHTML = cases.map((caseItem, index) => `
        <div class="case-card card-enter" 
             data-id="${caseItem.id}"
             data-category="${caseItem.category}"
             data-format="${caseItem.format}"
             data-score="${caseItem.score}"
             data-plays="${parseNumberString(caseItem.playsTotal)}"
             data-likes="${caseItem.likes}"
             data-index="${index}">
            
            <!-- 视频区域 - 使用视频第一帧作为封面 -->
            <div class="card-media" onclick="playCaseVideo(${index})">
                <video class="card-video" 
                       src="${caseItem.video}" 
                       muted 
                       loop 
                       playsinline
                       preload="metadata"></video>
                <div class="play-btn">▶</div>
                <div class="score-badge">
                    <span class="score-label">跑量分</span>
                    <span class="score-value">${caseItem.score}</span>
                </div>
            </div>
            
            <!-- 内容区域 (点击打开详情) -->
            <div class="card-content" onclick="handleCaseClick(${index})">
                <h3 class="card-title">${caseItem.title}</h3>
                
                <div class="brand-info">
                    <span class="brand-logo">${caseItem.brandLogo}</span>
                    <span class="brand-name">${caseItem.brand}</span>
                    <span class="brand-followers">粉丝数:${caseItem.followers}</span>
                </div>
                
                <div class="metrics">
                    <div class="metric-row">
                        <span class="metric-label">投放天数:</span>
                        <span class="metric-value">${caseItem.launchDays}天</span>
                        <span class="metric-label" style="margin-left:12px">${caseItem.launchDateRange}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">预估播放:</span>
                        <span class="metric-value highlight">近3日:${caseItem.plays3d}</span>
                        <span class="metric-value" style="margin-left:8px">总量:${caseItem.playsTotal}</span>
                    </div>
                </div>
                
                <div class="interaction-bar">
                    <span class="interaction-item">
                        <span class="interaction-icon">❤️</span>
                        <span>${formatInteraction(caseItem.likes)}</span>
                    </span>
                    <span class="interaction-item">
                        <span class="interaction-icon">💬</span>
                        <span>${formatInteraction(caseItem.comments)}</span>
                    </span>
                    <span class="interaction-item">
                        <span class="interaction-icon">⭐</span>
                        <span>${formatInteraction(caseItem.saves)}</span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
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
