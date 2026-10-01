// ============================================================
//  menu.js — Menu Page logic (Search, Category Filters, Cart)
// ============================================================

let currentCategory = 'All';
let currentQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  renderCategoryTabs();
  renderMenuDishes();

  // Search input handler
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim();
      renderMenuDishes();
    });
  }

  // Handle URL hash filtering (e.g., menu.html#must-try)
  if (window.location.hash === '#must-try') {
    currentCategory = 'Must Try';
    updateActiveTab('Must Try');
    renderMenuDishes();
  }
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

/* ---------- Render Category Tabs ---------- */
function renderCategoryTabs() {
  const container = document.getElementById('filterTabs');
  if (!container) return;

  const categories = getCategories();
  const allTabs = ['All', 'Must Try', ...categories.filter(c => c !== 'All')];

  container.innerHTML = allTabs.map(cat => `
    <button class="filter-tab ${cat === currentCategory ? 'active' : ''}"
            onclick="selectCategory('${cat}')">
      ${cat === 'Must Try' ? '⭐ Must Try' : cat}
    </button>
  `).join('');
}

/* ---------- Category Selection ---------- */
function selectCategory(cat) {
  currentCategory = cat;
  updateActiveTab(cat);
  renderMenuDishes();
}

function updateActiveTab(cat) {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    const text = tab.textContent.trim().replace('⭐ ', '');
    if (text === cat) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

/* ---------- Filter and Render Dishes ---------- */
function renderMenuDishes() {
  const grid = document.getElementById('menuCardsGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  let filtered = CANTEEN_DATA;

  if (currentCategory === 'Must Try') {
    filtered = filtered.filter(d => d.mustTry);
  } else if (currentCategory !== 'All') {
    filtered = filtered.filter(d => d.category === currentCategory);
  }

  if (currentQuery) {
    const q = currentQuery.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.availability.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    grid.innerHTML = filtered.map(dish => buildDishCard(dish)).join('');
  }
}

/* ---------- Build Dish Card HTML ---------- */
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
