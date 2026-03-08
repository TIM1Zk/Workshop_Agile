const AppState = {
    balance: 1250.00,
    selectedAmount: 0,
    paymentMethod: 'promptpay'
};

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the top-up page
    if (document.getElementById('screen-topup')) {
        updateTopupSummary();
    }
});

// --- Auth Actions ---
function doLogin() {
    const phone = document.getElementById('loginPhone').value;
    const pass = document.getElementById('loginPass').value;
    
    if (!phone || !pass) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
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

function updateProfile() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;

    if (!name || !phone) {
        showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'error');
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
        summaryAmount.style.color = (AppState.selectedAmount > 0 && AppState.selectedAmount < 300) ? 'var(--error)' : 'white';
    }
}

function goToPayment() {
    if (AppState.selectedAmount < 300) return;
    
    // Pass the topup amount to next page
    localStorage.setItem('lastTopupAmount', AppState.selectedAmount);
    window.location.href = 'qrcode.html';
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