/**
 * 创意大师 - 认证相关逻辑
 * 负责: 登录、注册、验证码、状态管理
 */

// ============================================
// 验证码倒计时
// ============================================
let codeCountdown = null;
let countdownSeconds = 60;

document.addEventListener('DOMContentLoaded', () => {
    const getCodeBtn = document.getElementById('get-code-btn');
    const phoneInput = document.getElementById('phone-input');
    const codeInput = document.getElementById('code-input');
    const loginForm = document.getElementById('login-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const agreementCheckbox = document.getElementById('agreement-checkbox');
    
    // 获取验证码
    if (getCodeBtn) {
        getCodeBtn.addEventListener('click', () => {
            const phone = phoneInput.value.trim();
            
            // 验证手机号
            if (!validatePhone(phone)) {
                showToast('请输入正确的手机号', 'error');
                phoneInput.focus();
                return;
            }
            
            // 开始倒计时
            startCodeCountdown();
            showToast('验证码已发送 (模拟: 123456)', 'success');
        });
    }
    
    // 登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // 切换到注册
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            // 可以切换到注册表单，这里简化处理
            showToast('注册功能开发中，请直接登录体验', 'info');
        });
    }
});

// 验证手机号
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 开始验证码倒计时
function startCodeCountdown() {
    const getCodeBtn = document.getElementById('get-code-btn');
    if (!getCodeBtn) return;
    
    countdownSeconds = 60;
    getCodeBtn.disabled = true;
    getCodeBtn.textContent = `${countdownSeconds}s`;
    
    codeCountdown = setInterval(() => {
        countdownSeconds--;
        getCodeBtn.textContent = `${countdownSeconds}s`;
        
        if (countdownSeconds <= 0) {
            clearInterval(codeCountdown);
            getCodeBtn.disabled = false;
            getCodeBtn.textContent = '获取验证码';
        }
    }, 1000);
}

// 处理登录
function handleLogin() {
    const phoneInput = document.getElementById('phone-input');
    const codeInput = document.getElementById('code-input');
    const agreementCheckbox = document.getElementById('agreement-checkbox');
    
    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();
    
    // 验证
    if (!validatePhone(phone)) {
        showToast('请输入正确的手机号', 'error');
        phoneInput.focus();
        return;
    }
    
    if (!code || code.length !== 6) {
        showToast('请输入6位验证码', 'error');
        codeInput.focus();
        return;
    }
    
    if (!agreementCheckbox.checked) {
        showToast('请阅读并同意用户协议', 'warning');
        return;
    }
    
    // 模拟登录验证 (验证码 123456)
    if (code === '123456') {
        loginSuccess(phone);
    } else {
        showToast('验证码错误，请输入 123456', 'error');
    }
}

// 登录成功
function loginSuccess(phone) {
    // 更新全局状态
    AppState.isLoggedIn = true;
    AppState.userName = maskPhone(phone);
    AppState.userPoints = 1264;
    
    // 保存到 localStorage
    const userData = {
        phone: phone,
        name: maskPhone(phone),
        points: AppState.userPoints,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('creativemaster_user', JSON.stringify(userData));
    
    // 更新 UI
    updateUserUI();
    updateAvatarUI();
    
    // 关闭弹窗
    closeLoginModal();
    
    // 显示成功提示
    showToast('登录成功！欢迎使用创意大师', 'success');
    
    // 清空表单
    document.getElementById('phone-input').value = '';
    document.getElementById('code-input').value = '';
    document.getElementById('agreement-checkbox').checked = false;
}

// 手机号脱敏
function maskPhone(phone) {
    return phone.substring(0, 3) + '****' + phone.substring(7);
}

// 更新头像 UI
function updateAvatarUI() {
    const avatarImg = document.getElementById('avatar-img');
    if (avatarImg && AppState.isLoggedIn) {
        // 可以设置用户头像，这里用一个带首字母的圆形
        avatarImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EU%3C/text%3E%3C/svg%3E`;
    }
}

// 退出登录
function logout() {
    AppState.isLoggedIn = false;
    AppState.userName = '';
    AppState.userPoints = 0;
    
    localStorage.removeItem('creativemaster_user');
    
    // 重置头像
    const avatarImg = document.getElementById('avatar-img');
    if (avatarImg) {
        avatarImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ddd'/%3E%3Ccircle cx='20' cy='15' r='8' fill='%23999'/%3E%3Cellipse cx='20' cy='35' rx='12' ry='10' fill='%23999'/%3E%3C/svg%3E`;
    }
    
    updateUserUI();
    showToast('已退出登录', 'info');
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('creativemaster_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            AppState.isLoggedIn = true;
            AppState.userName = user.name;
            AppState.userPoints = user.points || 1264;
            updateAvatarUI();
        } catch (e) {
            console.log('用户数据解析失败');
        }
    }
});

// 导出全局函数
window.handleLogin = handleLogin;
window.logout = logout;
