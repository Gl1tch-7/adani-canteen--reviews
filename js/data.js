// ============================================================
//  Adani University Canteen — Data Store
//  Edit this file to update dish details, prices & reviews
// ============================================================

const CANTEEN_DATA = [
  {
    id: 1,
    name: "Masala Dosa",
    category: "South Indian",
    price: 40,
    availability: "Breakfast",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop",
    mustTry: true,
    adminReview: {
      taste: 4.5,
      quantity: 4,
      value: 5,
      overall: 4.5,
      worthIt: true,
      description: "Crispy golden dosa with perfectly spiced masala filling. The coconut chutney is a game-changer. The batter is fermented just right, giving it that signature tanginess. Comes with sambar and two chutneys. Absolute must-try for breakfast — one of the best value-for-money options in the canteen.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 2,
    name: "Vada Pav",
    category: "Snacks",
    price: 15,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop",
    mustTry: true,
    adminReview: {
      taste: 4,
      quantity: 3.5,
      value: 5,
      overall: 4,
      worthIt: true,
      description: "The classic Mumbai street snack done right. Spicy batata vada nestled in a soft pav with green chutney and dry garlic chutney. Ridiculously cheap and surprisingly filling. Best quick bite on campus without burning a hole in your pocket. Perfect between-class snack.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 3,
    name: "Rajma Chawal",
    category: "Meals",
    price: 60,
    availability: "Lunch",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop",
    mustTry: true,
    adminReview: {
      taste: 4.5,
      quantity: 5,
      value: 4.5,
      overall: 4.5,
      worthIt: true,
      description: "A hearty portion of slow-cooked rajma in rich tomato-onion gravy served with fluffy basmati rice and a pickle. The quantity is genuinely impressive — a full meal that keeps you going through afternoon classes. Comfort food at its finest. On Tuesdays, they add a papad — a bonus!",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 4,
    name: "Maggi Noodles",
    category: "Snacks",
    price: 30,
    availability: "Evening",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 3.5,
      quantity: 3,
      value: 3,
      overall: 3.5,
      worthIt: true,
      description: "Good old Maggi, nothing revolutionary, but hits the spot during evening study breaks. Consistent taste with extra veggies added. Portions can feel a bit small for the price. Best enjoyed hot right away. Decent comfort snack, especially on rainy evenings.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 5,
    name: "Samosa",
    category: "Snacks",
    price: 10,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 4,
      quantity: 3,
      value: 5,
      overall: 3.5,
      worthIt: true,
      description: "Crispy, flaky pastry with a well-spiced potato-pea filling. At ₹10, it's one of the cheapest snacks on campus. Best enjoyed hot right out of the fryer — avoid if they've been sitting for a while as the crust gets soggy. Comes with tamarind chutney.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 6,
    name: "Masala Chai",
    category: "Beverages",
    price: 10,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop",
    mustTry: true,
    adminReview: {
      taste: 4.5,
      quantity: 3.5,
      value: 5,
      overall: 4.5,
      worthIt: true,
      description: "This is NOT your average canteen chai. Strong, well-balanced masala blend with just the right amount of ginger and cardamom. Served piping hot. The soul of the canteen — start every morning with this. At ₹10, it's a steal. Pairs perfectly with any snack.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 7,
    name: "Cold Coffee",
    category: "Beverages",
    price: 35,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 3.5,
      quantity: 4,
      value: 3.5,
      overall: 3.5,
      worthIt: true,
      description: "A thick, creamy cold coffee that's great on hot afternoons. Good quantity for the price. Could use a stronger coffee kick but the sweetness is well-balanced. Pairs perfectly with a samosa during breaks. Great summer afternoon drink.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 8,
    name: "Paneer Thali",
    category: "Meals",
    price: 80,
    availability: "Lunch",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop",
    mustTry: true,
    adminReview: {
      taste: 4.5,
      quantity: 5,
      value: 4,
      overall: 4.5,
      worthIt: true,
      description: "A complete feast — paneer butter masala, dal, 3 rotis, rice, and salad. The paneer is fresh and the gravy is rich and buttery. Best full meal option in the canteen. Worth every rupee if you're looking for a satisfying lunch. Gets sold out fast — arrive before 1 PM!",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 9,
    name: "Poha",
    category: "Breakfast",
    price: 25,
    availability: "Breakfast",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 3.5,
      quantity: 4,
      value: 4.5,
      overall: 3.5,
      worthIt: true,
      description: "Light, flavorful poha garnished with sev, coriander, and a squeeze of lemon. A healthy and filling breakfast option. The portion size is generous and keeps you going until lunch. Simple but satisfying — great if you prefer a lighter breakfast over heavy dosas.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 10,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 20,
    availability: "Lunch",
    image: "https://images.unsplash.com/photo-1666183847093-6afc7e5a5c1a?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 4,
      quantity: 3,
      value: 3.5,
      overall: 3.5,
      worthIt: true,
      description: "Soft, spongy gulab jamuns soaked in perfectly sweetened rose-flavored syrup. Served warm (on good days). Two pieces for ₹20 feels slightly steep but the quality is solid. A sweet treat to round off your lunch. Best when fresh — ask for them warm.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 11,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 30,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 3.5,
      quantity: 3.5,
      value: 3.5,
      overall: 3.5,
      worthIt: true,
      description: "Toasted sandwich with cucumber, tomato, capsicum, and mint chutney. Fresh ingredients and well-toasted bread. Could use more filling but it's a decent, lighter snack option. Good choice if you're watching your intake. Best paired with ketchup from the counter.",
      reviewerName: "Canteen Editorial Team"
    }
  },
  {
    id: 12,
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 20,
    availability: "All Day",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
    mustTry: false,
    adminReview: {
      taste: 4,
      quantity: 4,
      value: 4.5,
      overall: 4,
      worthIt: true,
      description: "Refreshing fresh lime with soda — choose sweet, salted, or a mix. Perfectly chilled and made with real lime juice. An absolute savior in Ahmedabad's scorching heat. Best drink to beat the afternoon slump. Ask for 'half-half' (sweet + salted) for the best experience.",
      reviewerName: "Canteen Editorial Team"
    }
  }
];

// Helper: Get dish by ID
function getDishById(id) {
  return CANTEEN_DATA.find(d => d.id === parseInt(id));
}

// Helper: Get must-try dishes
function getMustTryDishes() {
  return CANTEEN_DATA.filter(d => d.mustTry);
}

// Helper: Get dishes by category
function getDishesByCategory(category) {
  if (category === 'All') return CANTEEN_DATA;
  return CANTEEN_DATA.filter(d => d.category === category);
}

// Helper: Get unique categories
function getCategories() {
  const cats = CANTEEN_DATA.map(d => d.category);
  return ['All', ...new Set(cats)];
}

// Helper: Render star HTML (supports half stars)
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += '<span class="star full">★</span>';
    } else if (rating >= i - 0.5) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star empty">★</span>';
    }
  }
  return html;
}
