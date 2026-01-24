/**
 * 创意大师 - 模板相关逻辑
 * 负责: 模板加载、渲染、交互、上传、生成模拟
 */

// ============================================
// 模板数据 (可替换为 fetch 从 JSON 加载)
// ============================================
const templatesData = [
    {
        id: 'tpl-001',
        name: '创意盲盒-有声版',
        category: 'hot',
        type: 'image',
        size: 'small',
        cover: 'assets/tpl-media/创意盲盒-use.webp',
        description: '随机创意灵感，有声版本，更具冲击力',
        usageCount: 3241,
        costPoints: 120
    },
    {
        id: 'tpl-002',
        name: '创意盲盒',
        category: 'hot',
        type: 'image',
        size: 'small',
        cover: 'assets/tpl-media/创意盲盒无声版-use.webp',
        description: '随机创意灵感，让您的商品与众不同',
        usageCount: 5892,
        costPoints: 100
    },
    {
        id: 'tpl-003',
        name: '迷你美白专家',
        category: 'beauty',
        type: 'video',
        video: 'assets/tpl-media/迷你美白专家-use.mp4',
        description: '美白护肤产品专属模板，小人演绎，生动有趣',
        usageCount: 2374,
        costPoints: 120
    },
    {
        id: 'tpl-004',
        name: '迷你珐斑师',
        category: 'beauty',
        type: 'video',
        video: 'assets/tpl-media/迷你珐斑师-use.mp4',
        description: '祛斑美白产品展示，迷你角色互动场景',
        usageCount: 1856,
        costPoints: 150
    },
    {
        id: 'tpl-005',
        name: '涂满奶油',
        category: 'general',
        type: 'video',
        video: 'assets/tpl-media/涂满奶油-use.mp4',
        description: '奶油涂抹效果，适合护肤品、食品等品类',
        usageCount: 2103,
        costPoints: 130
    },
    {
        id: 'tpl-006',
        name: '小人搅拌',
        category: 'general',
        type: 'video',
        video: 'assets/tpl-media/小人搅拌-use.mp4',
        description: '可爱小人搅拌场景，适合食品、饮料等品类',
        usageCount: 1432,
        costPoints: 100
    }
];

// 当前选中的模板索引
let currentTemplateIndex = 0;

// ============================================
// 加载和渲染模板
// ============================================
function loadTemplates() {
    renderTemplates(templatesData);
}

function renderTemplates(templates) {
    const grid = document.getElementById('template-grid');
    if (!grid) return;
    
    grid.innerHTML = templates.map((template, index) => {
        const isSmall = template.size === 'small';
        const isVideo = template.type === 'video';
        const sizeClass = isSmall ? 'card-small' : '';
        
        // 根据类型生成不同的媒体内容
        const mediaContent = isVideo 
            ? `<video class="card-video" 
                      src="${template.video}" 
                      muted 
                      loop 
                      playsinline
                      preload="metadata"></video>
               <div class="play-icon">▶</div>`
            : `<img class="card-cover" src="${template.cover}" alt="${template.name}">`;
        
        return `
            <div class="template-card card-enter ${sizeClass}" 
                 data-id="${template.id}"
                 data-category="${template.category}"
                 data-type="${template.type}"
                 data-index="${index}"
                 onclick="handleTemplateClick(${index})">
                <div class="card-media">
                    ${mediaContent}
                </div>
                <div class="card-info">
                    <div class="card-title">${template.name}</div>
                    <div class="card-action">随机灵感 →</div>
                </div>
            </div>
        `;
    }).join('');
    
    // 绑定悬停播放事件（仅视频卡片）
    bindTemplateHoverEvents();
}

// ============================================
// 悬停播放逻辑 - 视频第一帧作为封面
// ============================================
function bindTemplateHoverEvents() {
    const cards = document.querySelectorAll('.template-card');
    
    cards.forEach(card => {
        const video = card.querySelector('.card-video');
        
        card.addEventListener('mouseenter', () => {
            if (video && video.src) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0; // 回到第一帧
            }
        });
    });
}

// ============================================
// 模板点击处理
// ============================================
function handleTemplateClick(index) {
    currentTemplateIndex = index;
    const template = templatesData[index];
    openTemplateModal(template);
}

// 上下切换模板
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prev-template');
    const nextBtn = document.getElementById('next-template');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentTemplateIndex > 0) {
                currentTemplateIndex--;
                openTemplateModal(templatesData[currentTemplateIndex]);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentTemplateIndex < templatesData.length - 1) {
                currentTemplateIndex++;
                openTemplateModal(templatesData[currentTemplateIndex]);
            }
        });
    }
});

// ============================================
// 图片上传逻辑
// ============================================
let uploadedImageData = null;

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const uploadedImage = document.getElementById('uploaded-image');
    const removeUploadBtn = document.getElementById('remove-upload');
    const generateBtn = document.getElementById('generate-btn');
    
    if (!uploadArea) return;
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== removeUploadBtn) {
            fileInput.click();
        }
    });
    
    // 文件选择变化
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        }
    });
    
    // 移除上传的图片
    if (removeUploadBtn) {
        removeUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetUploadState();
        });
    }
    
    // 生成按钮点击
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (uploadedImageData) {
                startGeneration();
            } else {
                showToast('请先上传商品图片', 'warning');
            }
        });
    }
});

function handleFileUpload(file) {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showToast('请上传 JPG 或 PNG 格式的图片', 'error');
        return;
    }
    
    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('图片大小不能超过 10MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageData = e.target.result;
        showUploadPreview(uploadedImageData);
        updateGenerateButton(true);
        
        // 保存到最近使用
        saveToRecentUploads(uploadedImageData);
    };
    reader.readAsDataURL(file);
}

function showUploadPreview(imageData) {
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const uploadedImage = document.getElementById('uploaded-image');
    
    if (uploadPlaceholder && uploadPreview && uploadedImage) {
        uploadedImage.src = imageData;
        uploadPlaceholder.style.display = 'none';
        uploadPreview.style.display = 'block';
    }
}

function resetUploadState() {
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const fileInput = document.getElementById('file-input');
    
    uploadedImageData = null;
    
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
    if (uploadPreview) uploadPreview.style.display = 'none';
    if (fileInput) fileInput.value = '';
    
    updateGenerateButton(false);
}

function updateGenerateButton(enabled) {
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.disabled = !enabled;
    }
}

// 保存到最近使用
function saveToRecentUploads(imageData) {
    let recentUploads = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
    
    // 添加到开头，最多保存 5 张
    recentUploads.unshift(imageData);
    recentUploads = recentUploads.slice(0, 5);
    
    localStorage.setItem('recent_uploads', JSON.stringify(recentUploads));
    renderRecentUploads();
}

function renderRecentUploads() {
    const container = document.getElementById('recent-uploads-list');
    if (!container) return;
    
    const recentUploads = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
    
    container.innerHTML = recentUploads.map((img, index) => `
        <img src="${img}" alt="最近使用 ${index + 1}" onclick="useRecentUpload(${index})">
    `).join('');
}

function useRecentUpload(index) {
    const recentUploads = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
    if (recentUploads[index]) {
        uploadedImageData = recentUploads[index];
        showUploadPreview(uploadedImageData);
        updateGenerateButton(true);
    }
}

// ============================================
// 模拟生成流程
// ============================================
let generateInterval = null;

function startGeneration() {
    // 检查登录状态
    if (!AppState.isLoggedIn) {
        showToast('请先登录后再生成', 'warning');
        openLoginModal();
        return;
    }
    
    // 检查点数
    const currentTemplate = templatesData[currentTemplateIndex];
    if (AppState.userPoints < currentTemplate.costPoints) {
        showToast('点数不足，请先充值', 'warning');
        openRechargeModal();
        return;
    }
    
    // 关闭模板详情弹窗，打开生成中弹窗
    closeTemplateModal();
    openModal(document.getElementById('generating-modal'));
    
    // 模拟进度
    let progress = 0;
    const progressFill = document.getElementById('generate-progress');
    const progressText = document.getElementById('progress-text');
    
    generateInterval = setInterval(() => {
        // 进度增加，但永远不会到 100%
        progress += Math.random() * 3;
        if (progress > 95) progress = 95;
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.floor(progress) + '%';
    }, 500);
}

function cancelGeneration() {
    if (generateInterval) {
        clearInterval(generateInterval);
        generateInterval = null;
    }
    
    closeModal(document.getElementById('generating-modal'));
    showToast('已取消生成', 'info');
}

// 页面加载时渲染最近使用
document.addEventListener('DOMContentLoaded', renderRecentUploads);

// 导出全局函数
window.loadTemplates = loadTemplates;
window.handleTemplateClick = handleTemplateClick;
window.useRecentUpload = useRecentUpload;
window.cancelGeneration = cancelGeneration;
window.resetUploadState = resetUploadState;
