// ============================================================
//  orders.js — Live Student Order Tracking & Staff Kitchen Dashboard (Fixed Auto-Refresh)
// ============================================================

let previousOrderStatuses = {};
const STAFF_PIN = '1234'; // Default canteen staff PIN

document.addEventListener('DOMContentLoaded', () => {
  // Check PIN auth state on handler page
  checkStaffAuth();

  // Initial render
  renderStudentOrders();

  if (isStaffAuthenticated()) {
    renderHandlerDashboard();
  }

  // Cross-tab real-time storage event listener
  window.addEventListener('storage', (e) => {
    if (e.key === 'canteen_orders') {
      renderStudentOrders();
      if (isStaffAuthenticated()) {
        renderHandlerDashboard();
      }
      checkStatusNotifications();
    }
  });

  // Backup Auto-Refresh polling (every 2 seconds) for file:/// local environment
  setInterval(() => {
    renderStudentOrders();
    if (isStaffAuthenticated()) {
      renderHandlerDashboard();
    }
  }, 2000);
});

/* ---------- STAFF AUTHENTICATION (handler.html) ---------- */
function checkStaffAuth() {
  const lockScreen = document.getElementById('lockScreen');
  const dashboard = document.getElementById('protectedDashboard');
  if (!lockScreen || !dashboard) return;

  if (isStaffAuthenticated()) {
    lockScreen.style.display = 'none';
    dashboard.style.display = 'flex';
    renderHandlerDashboard();
  } else {
    lockScreen.style.display = 'flex';
    dashboard.style.display = 'none';
  }
}

function isStaffAuthenticated() {
  return sessionStorage.getItem('canteen_staff_auth') === 'true';
}

function handleStaffLogin(e) {
  e.preventDefault();
  const input = document.getElementById('staffPasscode');
  const err = document.getElementById('loginError');
  const pin = input ? input.value.trim() : '';

  if (pin === STAFF_PIN) {
    sessionStorage.setItem('canteen_staff_auth', 'true');
    sessionStorage.setItem('canteen_user_role', 'handler');
    if (err) err.style.display = 'none';
    checkStaffAuth();
    renderHandlerDashboard();
  } else {
    if (err) err.style.display = 'block';
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function lockDashboard() {
  sessionStorage.removeItem('canteen_staff_auth');
  sessionStorage.setItem('canteen_user_role', 'student');
  checkStaffAuth();
}

/* ---------- STUDENT ORDER TRACKING ---------- */
function renderStudentOrders() {
  const container = document.getElementById('myOrdersContainer');
  if (!container) return;

  const orders = getOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="no-orders-box">
        <div class="no-orders-icon">📦</div>
        <p>You have no active orders yet.</p>
        <small style="color:var(--mid);">Place an order from the menu to track its real-time preparation status!</small>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const isCompleted = order.status === 'Completed';
    const isCancelled = order.status === 'Cancelled';

    return `
      <div class="order-track-card ${order.status === 'Ready' ? 'pulse-ready' : ''}">
        <div class="otc-header">
          <div>
            <span class="otc-id">Order ${order.id}</span>
            <span class="otc-time">🕒 ${order.timestamp} (${order.date})</span>
          </div>
          <span class="status-badge status-${order.status.toLowerCase()}">${getStatusBadgeText(order.status)}</span>
        </div>

        <!-- Progress Timeline -->
        ${!isCancelled ? `
          <div class="timeline-wrap">
            <div class="timeline-step ${getStepClass(order.status, 1)}">
              <div class="step-icon">📋</div>
              <div class="step-label">Placed</div>
            </div>
            <div class="timeline-line ${getLineClass(order.status, 1)}"></div>
            <div class="timeline-step ${getStepClass(order.status, 2)}">
              <div class="step-icon">👨‍🍳</div>
              <div class="step-label">Preparing</div>
            </div>
            <div class="timeline-line ${getLineClass(order.status, 2)}"></div>
            <div class="timeline-step ${getStepClass(order.status, 3)}">
              <div class="step-icon">🔔</div>
              <div class="step-label">Ready!</div>
            </div>
            <div class="timeline-line ${getLineClass(order.status, 3)}"></div>
            <div class="timeline-step ${getStepClass(order.status, 4)}">
              <div class="step-icon">✅</div>
              <div class="step-label">Collected</div>
            </div>
          </div>
        ` : ''}

        <!-- Items Summary -->
        <div class="otc-items-list">
          ${order.items.map(item => `
            <div class="otc-item-row">
              <span>${item.qty} × ${item.name}</span>
              <span>₹${item.price * item.qty}</span>
            </div>
          `).join('')}
        </div>

        <div class="otc-footer">
          <div>
            <span class="payment-badge">${order.paymentStatus}</span>
          </div>
          <div class="otc-total">
            Total: <strong>₹${order.totalAmount}</strong>
          </div>
        </div>
      </div>
    `;
  }).reverse().join('');
}

function getStatusBadgeText(status) {
  switch (status) {
    case 'Placed': return '📋 Order Placed';
    case 'Preparing': return '👨‍🍳 Preparing in Kitchen';
    case 'Ready': return '🔔 READY FOR PICKUP!';
    case 'Completed': return '✅ Order Completed';
    case 'Cancelled': return '❌ Order Cancelled';
    default: return status;
  }
}

function getStepClass(currentStatus, stepNum) {
  const map = { 'Placed': 1, 'Preparing': 2, 'Ready': 3, 'Completed': 4 };
  const val = map[currentStatus] || 0;
  if (val > stepNum) return 'completed';
  if (val === stepNum) return 'active';
  return '';
}

function getLineClass(currentStatus, lineNum) {
  const map = { 'Placed': 1, 'Preparing': 2, 'Ready': 3, 'Completed': 4 };
  const val = map[currentStatus] || 0;
  return val > lineNum ? 'filled' : '';
}

/* Audio notification when status becomes Ready */
function checkStatusNotifications() {
  const orders = getOrders();
  orders.forEach(order => {
    const prevStatus = previousOrderStatuses[order.id];
    if (prevStatus && prevStatus !== 'Ready' && order.status === 'Ready') {
      playBellSound();
      if (typeof showToast === 'function') {
        showToast(`🔔 Order ${order.id} is READY FOR PICKUP at the counter!`);
      }
    }
    previousOrderStatuses[order.id] = order.status;
  });
}

function playBellSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.log('Audio alert ready');
  }
}

/* ---------- CANTEEN HANDLER DASHBOARD LOGIC ---------- */
function renderHandlerDashboard() {
  const grid = document.getElementById('handlerOrdersGrid');
  if (!grid || !isStaffAuthenticated()) return;

  const orders = getOrders();

  if (orders.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; color: #888;">
        <div style="font-size: 3rem; margin-bottom: 12px;">👨‍🍳</div>
        <h3>No orders received yet today</h3>
        <p>New orders submitted by students will automatically appear here in real-time!</p>
      </div>
    `;
    return;
  }

  const filter = window.currentHandlerFilter || 'All';
  let filteredOrders = orders;
  if (filter === 'Pending') filteredOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Preparing');
  if (filter === 'Ready') filteredOrders = orders.filter(o => o.status === 'Ready');
  if (filter === 'Completed') filteredOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  grid.innerHTML = filteredOrders.map(order => `
    <div class="handler-order-card card-status-${order.status.toLowerCase()}">
      <div class="hoc-header">
        <div>
          <span class="hoc-id">${order.id}</span>
          <span class="hoc-name">👤 ${escapeHtml(order.studentName)}</span>
          ${order.phone ? `<span class="hoc-phone">📞 ${escapeHtml(order.phone)}</span>` : ''}
        </div>
        <span class="status-badge status-${order.status.toLowerCase()}">${getStatusBadgeText(order.status)}</span>
      </div>

      <div class="hoc-items">
        ${order.items.map(item => `
          <div class="hoc-item-row">
            <span class="hoc-qty">${item.qty}×</span>
            <span class="hoc-item-name">${item.name}</span>
            <span class="hoc-item-price">₹${item.price * item.qty}</span>
          </div>
        `).join('')}
      </div>

      <div class="hoc-meta">
        <div>
          <span class="payment-badge">${order.paymentStatus}</span>
          <span class="hoc-time">🕒 ${order.timestamp}</span>
        </div>
        <div class="hoc-total">
          Total: <strong>₹${order.totalAmount}</strong>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="hoc-actions">
        ${order.status === 'Placed' ? `
          <button class="btn-action btn-prep" onclick="changeStatus('${order.id}', 'Preparing')">👨‍🍳 Start Preparing</button>
        ` : ''}

        ${order.status === 'Preparing' ? `
          <button class="btn-action btn-ready" onclick="changeStatus('${order.id}', 'Ready')">🔔 Mark Ready for Pickup</button>
        ` : ''}

        ${order.status === 'Ready' ? `
          <button class="btn-action btn-complete" onclick="changeStatus('${order.id}', 'Completed')">✅ Mark Completed / Collected</button>
        ` : ''}

        ${order.status !== 'Completed' && order.status !== 'Cancelled' ? `
          <button class="btn-action btn-cancel" onclick="changeStatus('${order.id}', 'Cancelled')">❌ Cancel</button>
        ` : ''}
      </div>
    </div>
  `).reverse().join('');
}

function changeStatus(orderId, newStatus) {
  if (!isStaffAuthenticated()) return;
  updateOrderStatus(orderId, newStatus);
  renderHandlerDashboard();
  renderStudentOrders();
}

function setHandlerFilter(filterName, btn) {
  window.currentHandlerFilter = filterName;
  document.querySelectorAll('.handler-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHandlerDashboard();
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}
