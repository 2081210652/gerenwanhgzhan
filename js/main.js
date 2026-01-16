/* ============================================
   张震个人网站 - 主脚本
   ============================================ */

// --- 1. 打字机效果 ---
const text = "> 专注AIGC落地与RAG智能体架构设计 | AI Native思维践行者";
const typeWriterElement = document.getElementById('typewriter');
let i = 0;

function typeWriter() {
    if (i < text.length) {
        typeWriterElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

setTimeout(typeWriter, 1000);

// --- 2. Tab 按钮切换逻辑 ---
const navButtons = document.querySelectorAll('.nav-button');
const tabSections = document.querySelectorAll('.tab-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if(!targetId) return; // 忽略详情页内部的nav-button

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabSections.forEach(sec => {
            sec.classList.toggle('active', sec.id === targetId);
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
        }
    });
});

// --- 3. 详情页 Overlay 逻辑 ---
const overlay = document.getElementById('project-detail-overlay');
const templateGrid = document.getElementById('template-grid');
const zoomContainer = document.getElementById('zoom-container');
let cardMinWidth = 280; // 初始卡片最小宽度
let casesData = []; // 存储从 JSON 加载的数据

function openProjectDetail(projectId) {
    if (projectId === 'creative-master') {
        // 跳转到独立的创意大师项目页面
        window.open('projects/creative-master/index.html', '_blank');
        return;
    }
    
    // 其他项目继续使用 overlay 展示
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止主页滚动
}

function closeProjectDetail() {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 从 JSON 加载数据并渲染
async function loadAndRenderTemplates() {
    if (casesData.length === 0) {
        try {
            const response = await fetch('data/cases.json');
            const data = await response.json();
            casesData = data.creativeMaster || [];
        } catch (error) {
            console.error('加载案例数据失败:', error);
            // 使用备用数据
            casesData = getBackupCasesData();
        }
    }
    renderTemplates(casesData);
}

// 备用数据（当 JSON 加载失败时使用）
function getBackupCasesData() {
    return [
        {
            title: '天凉了，羽绒服湿巾可要备起来了，有了...',
            brand: '德佑家居清洁旗舰店直播间',
            logo: '德',
            followers: '29.5w',
            score: 89,
            days: '18天',
            plays3d: '14.3w',
            playsTotal: '921.1w',
            likes: '1.1w',
            comments: '2,300',
            saves: '4,279',
            cover: 'assets/cases/case1/cover.jpg',
            video: 'assets/cases/case1/video.mp4'
        },
        {
            title: '韩束新号开播，9.9元洁面炸不停',
            brand: '韩束尾品会',
            logo: '韩',
            followers: '19w',
            score: 81,
            days: '5天',
            plays3d: '32',
            playsTotal: '205.7w',
            likes: '3,798',
            comments: '318',
            saves: '1,374',
            cover: 'assets/cases/case2/cover.jpg',
            video: 'assets/cases/case2/video.mp4'
        },
        {
            title: '重新富养自己，做外在体面，内在富足的...',
            brand: '珀莱雅官方旗舰店',
            logo: '珀',
            followers: '1,229.5w',
            score: 86,
            days: '3天',
            plays3d: '34',
            playsTotal: '571.3w',
            likes: '2,653',
            comments: '285',
            saves: '795',
            cover: 'assets/cases/case3/cover.jpg',
            video: 'assets/cases/case3/video.mp4'
        },
        {
            title: '新年不允许有细纹！丸美胶原小金针眼膜精准狙...',
            brand: '丸美眼膜官方直播间',
            logo: '丸',
            followers: '21w',
            score: 86,
            days: '14天',
            plays3d: '15.2w',
            playsTotal: '567.2w',
            likes: '5,362',
            comments: '123',
            saves: '2,979',
            cover: 'assets/cases/case4/cover.jpg',
            video: 'assets/cases/case4/video.mp4'
        },
        {
            title: '懒人湿敷福音！改善粗糙闭口问题#C咖酸酶水 #...',
            brand: 'C咖官方旗舰店油皮酸酶护...',
            logo: 'C',
            followers: '22.6w',
            score: 82,
            days: '15天',
            plays3d: '8w',
            playsTotal: '223.8w',
            likes: '3,994',
            comments: '136',
            saves: '1,889',
            cover: 'assets/cases/case5/cover.jpg',
            video: 'assets/cases/case5/video.mp4'
        }
    ];
}

// 渲染模板案例
function renderTemplates(templates) {
    templateGrid.innerHTML = '';

    templates.forEach(t => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.onclick = () => openVideo(t.video);
        card.innerHTML = `
            <div class="template-thumb-container">
                <img src="${t.cover}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'" alt="封面">
                <div class="score-badge">跑量分<span>${t.score}</span></div>
                <div class="play-overlay">▶</div>
            </div>
            <div class="template-info">
                <div class="case-title">${t.title}</div>
                <div class="brand-info">
                    <div class="brand-logo" style="background:linear-gradient(135deg, #ff6b6b, #ee0979)">${t.logo}</div>
                    <span>${t.brand}</span>
                    <span style="color:#eee">|</span>
                    <span>粉丝数: ${t.followers}</span>
                </div>
                
                <div class="metric-row">
                    <span class="metric-label">投放天数</span>
                    <span class="tag-gray">📅 ${t.days}</span>
                </div>

                <div class="metric-row">
                    <span class="metric-label">预估播放</span>
                    <span class="tag-blue">近3日: ${t.plays3d}</span>
                    <span class="tag-blue">总量: ${t.playsTotal}</span>
                </div>

                <div class="interaction-bar">
                    <div class="stat-item">❤️ ${t.likes}</div>
                    <div class="stat-item" style="color:#ff9f43; background:#fff8ed;">💬 ${t.comments}</div>
                    <div class="stat-item" style="color:#ff6b6b; background:#fff2f2;">⭐ ${t.saves}</div>
                </div>
            </div>
        `;
        templateGrid.appendChild(card);
    });
}

// 鼠标滚轮缩放逻辑 - 动态调整卡片宽度实现响应式布局
overlay.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 30 : -30; // 滚轮向下缩小卡片，向上放大
        cardMinWidth = Math.min(Math.max(280, cardMinWidth + delta), 450); // 限制范围 280px(一行4个) ~ 450px(一行2-3个)
        templateGrid.style.setProperty('--card-min-width', cardMinWidth + 'px');
    }
}, { passive: false });

// --- 4. 视频播放器逻辑 ---
const videoModal = document.getElementById('video-player-modal');
const videoPlayer = document.getElementById('video-player');

function openVideo(videoSrc) { 
    videoPlayer.src = videoSrc;
    videoModal.style.display = 'flex'; 
    videoPlayer.play();
}

function closeVideo() { 
    videoPlayer.pause();
    videoPlayer.src = '';
    videoModal.style.display = 'none'; 
}

// --- 5. 滚动显现动画 ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item, .skill-card').forEach(el => observer.observe(el));

// --- 6. 动态背景 Canvas ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
const particleCount = 60, connectionDistance = 150, moveSpeed = 0.5;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 242, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = Array.from({length: particleCount}, () => new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
        p.update(); p.draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 234, ${1 - dist/connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); animate();
