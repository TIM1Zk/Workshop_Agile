const AppState = {
    balance: 1250.00,
    selectedAmount: 0,
    paymentMethod: 'promptpay'
};

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the top-up page
    if (document.getElementById('screen-topup')) {
        const savedAmount = localStorage.getItem('lastTopupAmount');
        if (savedAmount) {
            const inputField = document.getElementById('topup-amount-input');
            if (inputField) {
                inputField.value = savedAmount;
                AppState.selectedAmount = parseFloat(savedAmount) || 0;
            }
        }
        updateTopupSummary();
    }
});

// --- Auth Actions ---
function validatePhone(phone) {
    if (!phone) return 'ต้องไม่เป็นค่าว่าง';
    if (/\s/.test(phone)) return 'ต้องไม่มีเว้นวรรค หรือช่องว่าง';
    if (!/^[0-9]+$/.test(phone)) return 'ต้องเป็นตัวเลขเท่านั้น';
    if (phone.length !== 10) return 'ต้องมีความยาว 10 ตัวอักษร';
    return null;
}

function validatePassword(pass) {
    if (!pass) return 'ต้องไม่เป็นค่าว่าง';
    if (/\s/.test(pass)) return 'ต้องไม่มีเว้นวรรค หรือช่องว่าง';
    if (pass.length < 8 || pass.length > 16) return 'มีความยาวตั้งแต่ 8 - 16 ตัวอักษร';
    if (!/^[a-zA-Z0-9!#_\.]+$/.test(pass)) return 'ต้องเป็นอักษรอังกฤษตัวเลข รวมอักขระพิเศษ[!#_.]';
    return null;
}

function clearErrors() {
    const errorInputs = document.querySelectorAll('.input-error');
    errorInputs.forEach(input => input.classList.remove('input-error'));
}

function doLogin() {
    clearErrors();
    const phoneInput = document.getElementById('loginPhone');
    const passInput = document.getElementById('loginPass');
    const phone = phoneInput.value;
    const pass = passInput.value;
    
    const phoneError = validatePhone(phone);
    if (phoneError) {
        phoneInput.classList.add('input-error');
        showToast('เบอร์มือถือ: ' + phoneError, 'error');
        return;
    }
    
    const passError = validatePassword(pass);
    if (passError) {
        passInput.classList.add('input-error');
        showToast('รหัสผ่าน: ' + passError, 'error');
        return;
    }
    
    showToast('เข้าสู่ระบบสำเร็จ', 'success');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

function logout() {
    window.location.href = 'login.html';
}

function validateName(name) {
    if (!name || !name.trim()) return 'ต้องไม่เป็นค่าว่าง';
    if (name.length < 2 || name.length > 50) return 'ต้องมีความยาวตั้งแต่ 2 - 50 ตัวอักษร';
    if (!/^[a-zA-Zก-๙\s]+$/.test(name)) return 'ต้องเป็นอักษรภาษาไทยหรืออังกฤษเท่านั้น';
    return null;
}

function validateEmail(email) {
    if (!email || !email.trim()) return 'ต้องไม่เป็นค่าว่าง';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'ต้องเป็นรูปแบบมาตรฐาน email ที่ถูกต้อง';
    return null;
}

function validateGender(gender) {
    if (!gender) return 'ต้องเลือกเพศอย่างน้อย 1 เพศ';
    return null;
}

function validateAddress(address) {
    if (address && address.length > 100) return 'ห้ามมีตัวอักษรเกิน 100';
    return null;
}

function updateProfile() {
    clearErrors();
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    const genderInput = document.getElementById('editGender');
    const addressInput = document.getElementById('editAddress');

    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';
    const phone = phoneInput ? phoneInput.value : '';
    const gender = genderInput ? genderInput.value : '';
    const address = addressInput ? addressInput.value : '';

    const nameError = validateName(name);
    if (nameError) {
        if (nameInput) nameInput.classList.add('input-error');
        showToast('ชื่อ-นามสกุล: ' + nameError, 'error');
        return;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
        if (phoneInput) phoneInput.classList.add('input-error');
        showToast('เบอร์มือถือ: ' + phoneError, 'error');
        return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
        if (emailInput) emailInput.classList.add('input-error');
        showToast('อีเมล: ' + emailError, 'error');
        return;
    }

    const genderError = validateGender(gender);
    if (genderError) {
        if (genderInput) genderInput.classList.add('input-error');
        showToast('เพศ: ' + genderError, 'error');
        return;
    }

    const addressError = validateAddress(address);
    if (addressError) {
        if (addressInput) addressInput.classList.add('input-error');
        showToast('ที่อยู่ตั้งต้น: ' + addressError, 'error');
        return;
    }

    showToast('บันทึกข้อมูลสำเร็จ', 'success');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

// --- Top-Up Actions ---
function selectAmount(amount, element) {
    AppState.selectedAmount = parseFloat(amount) || 0;
    
    // UI Update (if grid exists)
    const btns = document.querySelectorAll('.amount-btn');
    if (btns.length > 0) {
        btns.forEach(btn => btn.classList.remove('selected'));
        element.classList.add('selected');
    }
    
    updateTopupSummary();
}

function updateSummary(val) {
    AppState.selectedAmount = parseFloat(val) || 0;
    updateTopupSummary();
}

function updateTopupSummary() {
    const summaryBalance = document.getElementById('summary-balance-display');
    const summaryTotal = document.getElementById('summary-total-display');
    const summaryAmount = document.getElementById('summary-amount-display');
    const minAmountError = document.getElementById('min-amount-error');
    const payButton = document.getElementById('pay-button');

    const isValid = AppState.selectedAmount >= 300;

    if (minAmountError) {
        const isEntryInvalid = AppState.selectedAmount !== 0 && AppState.selectedAmount < 300;
        minAmountError.style.display = isEntryInvalid ? 'block' : 'none';
        
        if (AppState.selectedAmount <= 0 && document.getElementById('topup-amount-input').value !== "") {
            minAmountError.style.display = 'block';
        }
    }

    if (payButton) {
        payButton.disabled = !isValid;
    }

    if (summaryBalance) {
        summaryBalance.textContent = `฿${AppState.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }
    
    if (summaryTotal) {
        const total = AppState.balance + (isValid ? AppState.selectedAmount : 0);
        summaryTotal.textContent = `฿${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        summaryTotal.parentElement.style.opacity = isValid ? '1' : '0.5';
    }
    
    if (summaryAmount) {
        summaryAmount.textContent = `฿${AppState.selectedAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        summaryAmount.style.color = (AppState.selectedAmount > 0 && AppState.selectedAmount < 300) ? 'var(--error)' : '#000000';
    }
}

function goToPayment() {
    if (AppState.selectedAmount < 300) return;
    
    // Pass the topup amount to next page
    localStorage.setItem('lastTopupAmount', AppState.selectedAmount);
    window.location.href = `qrcode.html?amount=${AppState.selectedAmount}`;
}

async function doTopup() {
    showToast('กำลังดำเนินการ...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        AppState.balance += AppState.selectedAmount;
        showToast(`เติมเงินสำเร็จ ฿${AppState.selectedAmount.toLocaleString()}`, 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }, 1500);
}

// --- Utils ---
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '12px';
    toast.style.marginBottom = '12px';
    toast.style.color = 'white';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
    toast.style.backgroundColor = type === 'success' ? 'var(--success)' : 
                                 type === 'error' ? 'var(--error)' : 
                                 type === 'info' ? 'var(--accent)' : 'var(--primary)';
    
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}