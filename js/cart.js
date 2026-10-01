// ============================================================
//  cart.js — Cart Drawer, Checkout & Payment Simulation
// ============================================================

let currentPaymentMethod = 'online';

document.addEventListener('DOMContentLoaded', () => {
  initCartUI();
  updateCartBadge();

  // Listen for cart changes
  window.addEventListener('cart_updated', () => {
    updateCartBadge();
    renderCartDrawer();
  });
});

function initCartUI() {
  // Inject Cart Drawer HTML & Checkout Modal into body if not already present
  if (!document.getElementById('cartDrawer')) {
    const cartHtml = `
      <!-- CART OVERLAY & DRAWER -->
      <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
      
      <div class="cart-drawer" id="cartDrawer">
        <div class="cart-header">
          <h3>🛒 Your Food Cart</h3>
          <button class="cart-close-btn" onclick="closeCart()">✕</button>
        </div>

        <div class="cart-body" id="cartItemsList">
          <!-- Populated by renderCartDrawer() -->
        </div>

        <div class="cart-footer" id="cartFooter">
          <div class="cart-total-row">
            <span>Total Amount:</span>
            <span class="cart-total-price" id="cartTotalPrice">₹0</span>
          </div>
          <button class="btn-checkout" onclick="openCheckoutModal()">Proceed to Checkout ➔</button>
        </div>
      </div>

      <!-- CHECKOUT MODAL -->
      <div class="modal-overlay" id="checkoutModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>🛍️ Complete Your Order</h3>
            <button class="modal-close" onclick="closeCheckoutModal()">✕</button>
          </div>

          <form id="checkoutForm" onsubmit="handleCheckoutSubmit(event)">
            <div class="form-group">
              <label class="form-label">Student Name / Roll No *</label>
              <input type="text" id="orderStudentName" class="form-input" placeholder="e.g. Rahul Sharma (AU-2024-042)" required />
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number (For Order SMS/Call)</label>
              <input type="tel" id="orderPhone" class="form-input" placeholder="e.g. 9876543210" required />
            </div>

            <!-- Payment Method Selection -->
            <div class="form-group">
              <label class="form-label">Payment Method *</label>
              <div class="payment-options">
                <label class="payment-option active" id="optOnline" onclick="selectPaymentMethod('online')">
                  <input type="radio" name="payMethod" value="online" checked />
                  <div class="pay-opt-text">
                    <span class="pay-title">📲 Pay Online (UPI / QR)</span>
                    <span class="pay-desc">Pay instantly using GPay / PhonePe / Paytm</span>
                  </div>
                </label>

                <label class="payment-option" id="optCounter" onclick="selectPaymentMethod('counter')">
                  <input type="radio" name="payMethod" value="counter" />
                  <div class="pay-opt-text">
                    <span class="pay-title">💵 Pay at Counter</span>
                    <span class="pay-desc">Pay in cash or UPI when picking up food</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- UPI QR Code View (if Online chosen) -->
            <div class="upi-qr-box" id="upiQrBox">
              <p class="upi-text">Scan QR Code or pay to UPI ID: <strong>canteen@adaniuni</strong></p>
              <div class="qr-code-img">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=canteen@adaniuni%26pn=AdaniUniversityCanteen" alt="UPI QR Code" />
              </div>
              <p class="upi-note">⚡ Click 'Confirm & Pay' below to simulate instant payment</p>
            </div>

            <div class="order-summary-box">
              <div class="summary-row">
                <span>Items Total:</span>
                <span id="summaryTotal">₹0</span>
              </div>
              <div class="summary-row grand-total">
                <span>Grand Total:</span>
                <span id="summaryGrandTotal">₹0</span>
              </div>
            </div>

            <button type="submit" class="btn-submit" id="btnConfirmOrder">🚀 Confirm &amp; Place Order</button>
          </form>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = cartHtml;
    document.body.appendChild(container);
  }
}

/* ---------- Cart Drawer Toggles & Rendering ---------- */
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer.classList.contains('open')) {
    closeCart();
  } else {
    renderCartDrawer();
    drawer.classList.add('open');
    overlay.classList.add('open');
  }
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function renderCartDrawer() {
  const list = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartFooter');
  const totalDisplay = document.getElementById('cartTotalPrice');
  if (!list) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart-msg">
        <div class="empty-cart-icon">🛒</div>
        <p>Your cart is empty!</p>
        <small style="color:var(--mid);">Add delicious dishes from the menu to place an order.</small>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  let total = 0;
  list.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} × ${item.qty} = <strong>₹${itemTotal}</strong></div>
        </div>
        <div class="cart-qty-ctrls">
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalDisplay) totalDisplay.textContent = `₹${total}`;
}

/* ---------- Checkout Modal Logic ---------- */
function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) return;

  closeCart();

  const modal = document.getElementById('checkoutModal');
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  document.getElementById('summaryTotal').textContent = `₹${total}`;
  document.getElementById('summaryGrandTotal').textContent = `₹${total}`;

  modal.classList.add('open');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.remove('open');
}

function selectPaymentMethod(method) {
  currentPaymentMethod = method;
  const optOnline = document.getElementById('optOnline');
  const optCounter = document.getElementById('optCounter');
  const qrBox = document.getElementById('upiQrBox');

  if (method === 'online') {
    optOnline.classList.add('active');
    optCounter.classList.remove('active');
    qrBox.style.display = 'block';
  } else {
    optCounter.classList.add('active');
    optOnline.classList.remove('active');
    qrBox.style.display = 'none';
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const cart = getCart();
  if (cart.length === 0) return;

  const name = document.getElementById('orderStudentName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const order = createOrder({
    studentName: name,
    phone: phone,
    items: cart,
    totalAmount: total,
    paymentMethod: currentPaymentMethod
  });

  closeCheckoutModal();

  // Show Toast
  if (typeof showToast === 'function') {
    showToast(`🎉 Order ${order.id} placed! Tracking status...`);
  } else {
    alert(`🎉 Order ${order.id} placed successfully!`);
  }

  // Redirect to active orders tracking page or show order status modal
  setTimeout(() => {
    window.location.href = `index.html#my-orders`;
  }, 1000);
}
