// ============================================================
//  role-select.js — Welcome Role Selection Popup (Student vs Handler)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelectionModal();

  // If role is not set in sessionStorage, show popup after 400ms
  const currentRole = sessionStorage.getItem('canteen_user_role');
  if (!currentRole) {
    setTimeout(() => {
      openRoleModal();
    }, 400);
  }
});

function initRoleSelectionModal() {
  if (document.getElementById('roleSelectModal')) return;

  const html = `
    <div class="modal-overlay" id="roleSelectModal">
      <div class="modal-card role-card-pop">
        <div class="role-pop-header">
          <div class="role-logo-icon">🍽️</div>
          <h2>Welcome to Adani University Canteen</h2>
          <p>Please select your role to proceed:</p>
        </div>

        <div class="role-options-grid">
          <button type="button" class="role-btn-card student-role" onclick="selectUserRole('student')">
            <div class="role-icon">🎓</div>
            <div class="role-title">I am a Student</div>
            <div class="role-desc">Order food online, view canteen menu &amp; read dish reviews</div>
          </button>

          <button type="button" class="role-btn-card handler-role" onclick="showStaffPinForm()">
            <div class="role-icon">👨‍🍳</div>
            <div class="role-title">I am Canteen Staff</div>
            <div class="role-desc">Manage kitchen orders &amp; update food preparation status</div>
          </button>
        </div>

        <!-- Hidden PIN input form inside modal for staff -->
        <div id="modalPinBox" style="display: none; margin-top: 20px; text-align: center;">
          <p style="font-size:0.9rem; color:var(--dark); margin-bottom:10px; font-weight:700;">🔒 Staff PIN Authentication Required</p>
          <form onsubmit="handleModalPinSubmit(event)">
            <input type="password" id="modalStaffPin" class="form-input" placeholder="Enter Staff PIN (Default: 1234)" style="text-align:center; font-size:1.1rem; letter-spacing:3px; max-width:280px; margin:0 auto 12px; display:block;" required />
            <div style="display:flex; gap:10px; justify-content:center;">
              <button type="button" class="btn-outline" style="color:var(--dark); border-color:var(--border); padding:8px 16px; font-size:0.88rem;" onclick="hideStaffPinForm()">← Back</button>
              <button type="submit" class="btn-primary" style="padding:8px 20px; font-size:0.88rem;">Unlock Dashboard 🔓</button>
            </div>
          </form>
          <p id="modalPinError" style="color:var(--red); font-size:0.82rem; margin-top:8px; display:none;">❌ Incorrect PIN. Access denied!</p>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
}

function openRoleModal() {
  const modal = document.getElementById('roleSelectModal');
  if (modal) modal.classList.add('open');
}

function closeRoleModal() {
  const modal = document.getElementById('roleSelectModal');
  if (modal) modal.classList.remove('open');
}

function selectUserRole(role) {
  sessionStorage.setItem('canteen_user_role', role);
  closeRoleModal();

  if (role === 'student') {
    if (window.location.pathname.includes('handler.html')) {
      window.location.href = 'index.html';
    }
  }
}

function showStaffPinForm() {
  const grid = document.querySelector('.role-options-grid');
  const pinBox = document.getElementById('modalPinBox');
  if (grid) grid.style.display = 'none';
  if (pinBox) {
    pinBox.style.display = 'block';
    document.getElementById('modalStaffPin').focus();
  }
}

function hideStaffPinForm() {
  const grid = document.querySelector('.role-options-grid');
  const pinBox = document.getElementById('modalPinBox');
  if (grid) grid.style.display = 'grid';
  if (pinBox) pinBox.style.display = 'none';
}

function handleModalPinSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('modalStaffPin');
  const err = document.getElementById('modalPinError');
  const pin = input ? input.value.trim() : '';

  const STAFF_PIN = '1234';

  if (pin === STAFF_PIN) {
    sessionStorage.setItem('canteen_user_role', 'handler');
    sessionStorage.setItem('canteen_staff_auth', 'true');
    closeRoleModal();
    window.location.href = 'handler.html';
  } else {
    if (err) err.style.display = 'block';
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}
