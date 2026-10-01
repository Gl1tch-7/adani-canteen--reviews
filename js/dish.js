// ============================================================
//  dish.js — Dish Detail & Student Review Submission Logic
// ============================================================

let currentDish = null;
const userRatings = { taste: 5, quantity: 5, value: 5, overall: 5 };

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();

  // Get dish ID from URL params (e.g. dish.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  currentDish = getDishById(id);

  if (!currentDish) {
    document.getElementById('dishDetailLayout').innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px;">
        <h2>❌ Dish Not Found</h2>
        <p style="margin: 12px 0 24px; color: var(--mid);">The requested item could not be found in our canteen menu.</p>
        <a href="menu.html" class="btn-primary">Back to Full Menu</a>
      </div>
    `;
    return;
  }

  document.title = `${currentDish.name} Review — Adani University Canteen`;

  renderDishDetail();
  renderStudentReviews();
  initStarSelectors();
});

/* ---------- Mobile Nav Toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });
}

/* ---------- Render Main Dish Info & Admin Review ---------- */
function renderDishDetail() {
  const layout = document.getElementById('dishDetailLayout');
  const r = currentDish.adminReview;

  layout.innerHTML = `
    <!-- Left Column: Dish Image -->
    <div>
      <img class="dish-main-img" src="${currentDish.image}" alt="${currentDish.name}"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'" />
    </div>

    <!-- Right Column: Meta & Admin Review -->
    <div>
      <div class="dish-meta">
        <div class="dish-title-row">
          <h1 class="dish-title">${currentDish.name}</h1>
          <span class="dish-price-big">₹${currentDish.price}</span>
        </div>

        <div class="dish-pills">
          <span class="pill pill-category">📁 ${currentDish.category}</span>
          <span class="pill pill-avail">🕐 ${currentDish.availability}</span>
          ${currentDish.mustTry ? '<span class="pill pill-must-try">⭐ Must Try Item</span>' : ''}
        </div>

        <!-- Worth It Banner -->
        <div class="worth-it-banner ${r.worthIt ? 'yes' : 'no'}">
          <span class="verdict-icon">${r.worthIt ? '✅' : '❌'}</span>
          <span>Verdict: ${r.worthIt ? 'Definitely Worth It!' : 'Not Worth The Money'}</span>
        </div>

        <!-- Admin Review Breakdown -->
        <div class="review-panel">
          <h3>🏆 Editorial Review Breakdown</h3>
          
          <table class="ratings-table">
            <tr>
              <td class="rating-label">😋 Taste</td>
              <td>
                <div class="rating-stars">
                  <div class="stars-display">${renderStars(r.taste)}</div>
                  <span class="rating-val">${r.taste}/5</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="rating-label">🥣 Quantity</td>
              <td>
                <div class="rating-stars">
                  <div class="stars-display">${renderStars(r.quantity)}</div>
                  <span class="rating-val">${r.quantity}/5</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="rating-label">💰 Value for Money</td>
              <td>
                <div class="rating-stars">
                  <div class="stars-display">${renderStars(r.value)}</div>
                  <span class="rating-val">${r.value}/5</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="rating-label">⭐ Overall Rating</td>
              <td>
                <div class="rating-stars">
                  <div class="stars-display">${renderStars(r.overall)}</div>
                  <span class="rating-val">${r.overall}/5</span>
                </div>
              </td>
            </tr>
          </table>

          <div class="review-text">
            "${r.description}"
          </div>
          <div class="review-author">— ${r.reviewerName}</div>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Render Interactive Star Rating Selectors ---------- */
function initStarSelectors() {
  const fields = ['Taste', 'Quantity', 'Value', 'Overall'];

  fields.forEach(field => {
    const key = field.toLowerCase();
    const container = document.getElementById(`starSelector${field}`);
    if (!container) return;

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<button type="button" class="star-btn active" data-field="${key}" data-val="${i}">★</button>`;
    }
    container.innerHTML = starsHtml;

    // Attach click events
    container.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.target.getAttribute('data-val'));
        userRatings[key] = val;
        updateStarUI(field, val);
      });
    });
  });
}

function updateStarUI(field, val) {
  const key = field.toLowerCase();
  const container = document.getElementById(`starSelector${field}`);
  const display = document.getElementById(`val${field}`);

  if (display) display.textContent = `${val}★`;

  if (container) {
    container.querySelectorAll('.star-btn').forEach(btn => {
      const btnVal = parseInt(btn.getAttribute('data-val'));
      if (btnVal <= val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* ---------- Student Reviews (localStorage) ---------- */
function renderStudentReviews() {
  const list = document.getElementById('studentReviewsList');
  if (!list || !currentDish) return;

  const key = `reviews_dish_${currentDish.id}`;
  const stored = JSON.parse(localStorage.getItem(key) || '[]');

  if (stored.length === 0) {
    list.innerHTML = `
      <div class="no-reviews-msg">
        <div class="no-rev-emoji">💬</div>
        <p>No student reviews submitted yet for <strong>${currentDish.name}</strong>.</p>
        <p style="font-size:0.85rem; margin-top:4px;">Be the first student to review this item below!</p>
      </div>
    `;
    return;
  }

  list.innerHTML = stored.map(rev => {
    const initial = rev.name.charAt(0).toUpperCase() || 'S';
    return `
      <div class="student-review-card">
        <div class="scr-header">
          <div class="scr-name">
            <div class="avatar">${initial}</div>
            <span>${escapeHtml(rev.name)}</span>
          </div>
          <span class="scr-date">📅 ${rev.date}</span>
        </div>

        <div class="scr-mini-ratings">
          <span class="mini-rating">😋 Taste: <span class="stars-display">${renderStars(rev.taste)}</span></span>
          <span class="mini-rating">🥣 Quantity: <span class="stars-display">${renderStars(rev.quantity)}</span></span>
          <span class="mini-rating">💰 Value: <span class="stars-display">${renderStars(rev.value)}</span></span>
          <span class="mini-rating">⭐ Overall: <span class="stars-display">${renderStars(rev.overall)}</span></span>
        </div>

        <div class="scr-comment">
          "${escapeHtml(rev.comment)}"
        </div>
      </div>
    `;
  }).reverse().join(''); // Show latest review first
}

/* ---------- Handle Form Submission ---------- */
function handleReviewSubmit(e) {
  e.preventDefault();
  if (!currentDish) return;

  const nameInput = document.getElementById('studentName');
  const commentInput = document.getElementById('reviewComment');

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (!name || !comment) return;

  const newReview = {
    name: name,
    taste: userRatings.taste,
    quantity: userRatings.quantity,
    value: userRatings.value,
    overall: userRatings.overall,
    comment: comment,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  // Save to localStorage
  const key = `reviews_dish_${currentDish.id}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(newReview);
  localStorage.setItem(key, JSON.stringify(existing));

  // Reset form
  nameInput.value = '';
  commentInput.value = '';
  ['Taste', 'Quantity', 'Value', 'Overall'].forEach(f => {
    userRatings[f.toLowerCase()] = 5;
    updateStarUI(f, 5);
  });

  // Show Toast
  showToast('✅ Your review has been published!');

  // Re-render student reviews list
  renderStudentReviews();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
