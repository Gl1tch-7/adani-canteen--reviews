// ============================================================
//  main.js — Homepage logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  renderMustTryGrid();
  renderFeaturedGrid();
  renderAllDishesGrid();
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
  // Count total student reviews across all dishes
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
  if (statCategories) statCategories.textContent = getCategories().length - 1; // minus 'All'
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

/* ---------- Featured Grid (top 3 by overall rating) ---------- */
function renderFeaturedGrid() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const sorted = [...CANTEEN_DATA].sort(
    (a, b) => b.adminReview.overall - a.adminReview.overall
  ).slice(0, 3);

  grid.innerHTML = sorted.map(dish => buildDishCard(dish)).join('');
}

/* ---------- All Dishes Grid (first 8) ---------- */
function renderAllDishesGrid() {
  const grid = document.getElementById('allDishesGrid');
  if (!grid) return;

  grid.innerHTML = CANTEEN_DATA.slice(0, 8).map(dish => buildDishCard(dish)).join('');
}

/* ---------- Build a dish card HTML ---------- */
function buildDishCard(dish) {
  const r = dish.adminReview;
  return `
    <div class="dish-card" onclick="goToDish(${dish.id})">
      <div class="card-img-wrap">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'" />
        <span class="card-category-tag">${dish.category}</span>
        ${dish.mustTry ? '<span class="must-try-badge">⭐ Must Try</span>' : ''}
      </div>
      <div class="card-body">
        <div class="card-top">
          <div class="card-name">${dish.name}</div>
          <span class="price-tag">₹${dish.price}</span>
        </div>
        <div class="card-stars">
          <div class="stars-display">${renderStars(r.overall)}</div>
          <span class="rating-number">${r.overall}/5</span>
        </div>
        <span class="availability-pill">🕐 ${dish.availability}</span>
      </div>
    </div>
  `;
}

/* ---------- Navigate to dish detail ---------- */
function goToDish(id) {
  window.location.href = `dish.html?id=${id}`;
}
