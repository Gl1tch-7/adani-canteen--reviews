// ============================================================
//  main.js — Homepage logic with Add to Cart buttons
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  renderMustTryGrid();
  renderFeaturedGrid();
  updateStats();
});

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });
}

/* ---------- Stats bar ---------- */
function updateStats() {
  let totalStudentReviews = 0;
  CANTEEN_DATA.forEach(dish => {
    const key = `reviews_dish_${dish.id}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    totalStudentReviews += stored.length;
  });

  const statTotal      = document.getElementById('statTotal');
  const statMustTry    = document.getElementById('statMustTry');
  const statCategories = document.getElementById('statCategories');
  const statReviews    = document.getElementById('statReviews');

  if (statTotal)      statTotal.textContent      = CANTEEN_DATA.length;
  if (statMustTry)    statMustTry.textContent    = getMustTryDishes().length;
  if (statCategories) statCategories.textContent = getCategories().length - 1;
  if (statReviews)    statReviews.textContent    = totalStudentReviews;
}

/* ---------- Must-Try Grid ---------- */
function renderMustTryGrid() {
  const grid = document.getElementById('mustTryGrid');
  if (!grid) return;

  const dishes = getMustTryDishes();
  grid.innerHTML = dishes.map(dish => `
    <div class="must-try-card" onclick="goToDish(${dish.id})">
      <div class="card-img-wrap">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'" />
        <div class="must-try-ribbon">
          <div class="dish-name">${dish.name}</div>
          <div class="dish-price">₹${dish.price} · ${dish.availability}</div>
        </div>
        <span class="must-try-badge">⭐ Must Try</span>
      </div>
    </div>
  `).join('');
}

/* ---------- Featured Grid ---------- */
function renderFeaturedGrid() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const sorted = [...CANTEEN_DATA].sort(
    (a, b) => b.adminReview.overall - a.adminReview.overall
  ).slice(0, 4);

  grid.innerHTML = sorted.map(dish => buildDishCard(dish)).join('');
}

/* ---------- Build a dish card HTML with Add to Cart ---------- */
function buildDishCard(dish) {
  const r = dish.adminReview;
  return `
    <div class="dish-card">
      <div class="card-img-wrap" onclick="goToDish(${dish.id})">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'" />
        <span class="card-category-tag">${dish.category}</span>
        ${dish.mustTry ? '<span class="must-try-badge">⭐ Must Try</span>' : ''}
      </div>
      <div class="card-body">
        <div class="card-top" onclick="goToDish(${dish.id})">
          <div class="card-name">${dish.name}</div>
          <span class="price-tag">₹${dish.price}</span>
        </div>
        <div class="card-stars" onclick="goToDish(${dish.id})">
          <div class="stars-display">${renderStars(r.overall)}</div>
          <span class="rating-number">${r.overall}/5</span>
        </div>
        <span class="availability-pill">🕐 ${dish.availability}</span>
        <button class="btn-add-cart" onclick="event.stopPropagation(); handleAddToCart(${dish.id})">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `;
}

function handleAddToCart(id) {
  addToCart(id, 1);
  toggleCart();
}

function goToDish(id) {
  window.location.href = `dish.html?id=${id}`;
}
