/* ============================================================
   AURA SKINCARE — script.js
   Products · Wishlist · Cart · Quick View · Search
   Ritual · Ingredients · Reviews · FAQ · Skin Quiz
   Newsletter · Navigation · UI Utilities
   ============================================================ */

window.dataLayer = window.dataLayer || [];
console.log("Forensics: Data Layer Initialized.");

document.addEventListener('DOMContentLoaded', () => {
    const testBtn = document.getElementById('test-track-btn');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            window.dataLayer.push({
                'event': 'test_forensics_event',
                'test_status': 'working'
            });
            console.log("Forensics: Test event pushed to dataLayer!");
        });
    }
});

'use strict';

/* ============================================================
   01. PRODUCT DATA
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: 'Dew Drop Hydrating Serum',
    cat: 'Serum',
    price: 799,
    mrp: 999,
    desc: 'Lightweight hydration for soft, refreshed-looking skin. 5% Hyaluronic Acid + Panthenol.',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 2841,
    chips: ['Hyaluronic Acid', 'Panthenol', '30ml'],
    notes: 'Use 2–3 drops on damp skin, morning & night. Layers beautifully under moisturizer and SPF.'
  },
  {
    id: 2,
    name: 'Cloud Nine Barrier Cream',
    cat: 'Moisturizer',
    price: 699,
    mrp: 899,
    desc: 'A comforting daily moisturizer for a smooth, supple feel. Ceramides + Squalane.',
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 1932,
    chips: ['Ceramides', 'Squalane', '50ml'],
    notes: 'Whipped, non-greasy cream that seals in hydration and supports your skin barrier.'
  },
  {
    id: 3,
    name: 'Pure Balance Gentle Cleanser',
    cat: 'Cleanser',
    price: 499,
    mrp: 649,
    desc: 'A gentle daily cleanse without an overly stripped feeling. Oat + Green Tea.',
    img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 2210,
    chips: ['Oat Extract', 'Green Tea', '150ml'],
    notes: 'pH 5.5 gel-cream cleanser. Removes SPF and light makeup while keeping skin calm.'
  },
  {
    id: 4,
    name: 'Verdant Botanical Toner',
    cat: 'Serum',
    price: 549,
    mrp: 699,
    desc: 'A mist-essence that preps, soothes and adds a first layer of hydration.',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop',
    badge: 'New',
    rating: 4.7,
    reviews: 842,
    chips: ['Centella', 'Rose Water', '100ml'],
    notes: 'Spritz or pat on after cleansing. Perfect for the 7-skin method, minus the effort.'
  },
  {
    id: 5,
    name: 'Sage + Oat Clay Mask',
    cat: 'Treatment',
    price: 649,
    mrp: 799,
    desc: 'A 10-minute reset for congested days. Purifies without drying or tightness.',
    img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
    badge: 'Limited',
    rating: 4.8,
    reviews: 1104,
    chips: ['Kaolin Clay', 'Sage', '75ml'],
    notes: 'Use 1–2× weekly on T-zone or all over. Rinse before it fully dries for best comfort.'
  },
  {
    id: 6,
    name: 'Midnight Renewal Face Oil',
    cat: 'Treatment',
    price: 899,
    mrp: 1199,
    desc: 'A silky overnight oil for glow by morning. Bakuchiol + Rosehip.',
    img: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
    badge: 'New',
    rating: 4.9,
    reviews: 967,
    chips: ['Bakuchiol', 'Rosehip', '30ml'],
    notes: 'Last step at night. 3 drops warmed between palms, pressed into skin. Wake up luminous.'
  }
];


/* ============================================================
   02. GLOBAL STATE & HELPERS
   ============================================================ */

const inr = (amount) =>
  '₹' + Number(amount).toLocaleString('en-IN');

const star = () => '★★★★★';

let cart = [];
let wishlist = new Set();
let discount = 0;

let qvId = 1;
let qvQty = 1;
let revIndex = 0;
let currentFilter = 'All';

let ingIdx = 0;
let quizStep = 0;
let quizAns = [];

let toastTimer;

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function getElement(id) {
  return document.getElementById(id);
}


/* ============================================================
   03. PRODUCT CARDS & SHOP FILTERS
   ============================================================ */

function cardHTML(product) {
  const wished = wishlist.has(product.id);

  return `
    <article class="card reveal in" data-product-name="${product.name}">
      <div class="card-img" onclick="openQuick(${product.id})">
        <span class="tag">${product.badge}</span>

        <img
          loading="lazy"
          src="${product.img}"
          alt="${product.name}"
        >

        <button
          class="wish ${wished ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleWish(${product.id})"
          aria-label="Toggle wishlist"
        >
          ${wished ? '♥' : '♡'}
        </button>
      </div>

      <div class="card-body">
        <div class="card-top">
          <h3 onclick="openQuick(${product.id})">
            ${product.name}
          </h3>

          <div class="price">
            <s>${inr(product.mrp)}</s>
            ${inr(product.price)}
          </div>
        </div>

        <div class="rating">
          <b>${star()}</b>
          ${product.rating}
          (${product.reviews.toLocaleString('en-IN')})
          · ${product.cat}
        </div>

        <p class="desc">${product.desc}</p>

        <div class="chips">
          ${product.chips
            .map((chip) => `<span class="chip">${chip}</span>`)
            .join('')}
        </div>

        <button
          class="addbtn"
          onclick="addToCart(${product.id}, 1, true)"
        >
          <span>Add to Bag</span>
          <span>${inr(product.price)} →</span>
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
  getElement('bestGrid').innerHTML = PRODUCTS
    .slice(0, 3)
    .map(cardHTML)
    .join('');

  renderShop(currentFilter);
}

function renderShop(filter = 'All') {
  currentFilter = filter;

  const products = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.cat === filter);

  getElement('shopGrid').innerHTML = products.length
    ? products.map(cardHTML).join('')
    : '<p style="color:var(--muted)">No products in this category yet.</p>';
}

function filterShop(filter) {
  document.querySelectorAll('.filter').forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.filter === filter
    );
  });

  renderShop(filter);

  const shop = getElement('shop');

  if (shop) {
    shop.scrollIntoView({ behavior: 'smooth' });
  }
}

getElement('filters').addEventListener('click', (event) => {
  const button = event.target.closest('.filter');

  if (button) {
    filterShop(button.dataset.filter);
  }
});


/* ============================================================
   04. WISHLIST
   ============================================================ */

function toggleWish(id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast('Removed from wishlist');
  } else {
    wishlist.add(id);
    showToast('Saved to wishlist ♡');
  }

  renderProducts();
}


/* ============================================================
   05. CART & PRICING
   ============================================================ */

function addToCart(id, qty = 1, shouldOpen = true) {
  const product = getProduct(id);

  if (!product) return;

   window.dataLayer.push({
    'event': 'add_to_cart',
    'ecommerce': {
      'currency': 'INR',
      'value': product.price * qty,
      'items': [{
        'item_id': product.id,
        'item_name': product.name,
        'item_category': product.cat,
        'price': product.price,
        'quantity': qty
      }]
    }
  });
  console.log("Forensics: add_to_cart pushed for", product.name, "Qty:", qty);

  const quantity = Math.max(1, Number(qty) || 1);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ id, qty: quantity });
  }

  updateCart();

  showToast(`${product.name} added to bag`);

  const bagCount = getElement('bagCount');

  bagCount.style.transform = 'scale(1.4)';

  setTimeout(() => {
    bagCount.style.transform = 'scale(1)';
  }, 200);

  if (shouldOpen) {
    openCart();
  }
}

function addBundle() {
  [3, 1, 2].forEach((id) => {
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
  });

  updateCart();
  showToast('Daily Ritual products added to your bag');
  openCart();
}

function calculateCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cart.reduce((sum, item) => {
    const product = getProduct(item.id);

    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const discountAmount = Math.round(subtotal * discount);
  const discountedSubtotal = subtotal - discountAmount;

  const shipping = subtotal === 0
    ? 0
    : discountedSubtotal >= 999
      ? 0
      : 49;

  const total = Math.max(
    0,
    discountedSubtotal + shipping
  );

  return {
    count,
    subtotal,
    discountAmount,
    shipping,
    total
  };
}

function updateCart() {
  const {
    count,
    subtotal,
    discountAmount,
    shipping,
    total
  } = calculateCart();

  getElement('bagCount').textContent = count;

  getElement('cartSub').textContent =
    `${count}${count === 1 ? ' item' : ' items'}`;

  getElement('subTotal').textContent = inr(subtotal);

  getElement('discountRow').textContent = discountAmount
    ? `-${inr(discountAmount)}`
    : '—';

  getElement('shipCost').textContent = subtotal === 0
    ? '—'
    : shipping === 0
      ? 'FREE'
      : inr(shipping);

  getElement('grandTotal').textContent = inr(total);

  getElement('shipBar').style.width =
    `${Math.min(100, (subtotal / 999) * 100)}%`;

  getElement('shipText').innerHTML = subtotal >= 999
    ? '🎉 You unlocked <b>FREE shipping</b>!'
    : `Add <b>${inr(Math.max(0, 999 - subtotal))}</b> more for FREE shipping`;

  renderCartItems();
}

function renderCartItems() {
  const cartItems = getElement('cartItems');

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty">
        <b>Your bag is empty</b>
        Your ritual is waiting to begin.
        <br><br>

        <button
          class="btn btn-dark"
          onclick="closeCart(); getElement('shop').scrollIntoView({behavior:'smooth'})"
        >
          Shop Bestsellers
        </button>
      </div>
    `;

    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = getProduct(item.id);

    if (!product) return '';

    return `
      <div class="cart-item">
        <img src="${product.img}" alt="${product.name}">

        <div>
          <b>${product.name}</b>

          <span style="font-size:12px;color:var(--muted)">
            ${inr(product.price)} · ${product.chips[2] || ''}
          </span>

          <div class="qty">
            <button
              onclick="changeQty(${product.id}, -1)"
              aria-label="Decrease quantity"
            >−</button>

            <b>${item.qty}</b>

            <button
              onclick="changeQty(${product.id}, 1)"
              aria-label="Increase quantity"
            >+</button>
          </div>

          <button
            class="remove"
            onclick="removeItem(${product.id})"
          >
            Remove
          </button>
        </div>

        <b>${inr(product.price * item.qty)}</b>
      </div>
    `;
  }).join('');
}

function changeQty(id, difference) {
  const item = cart.find((entry) => entry.id === id);

  if (!item) return;

  item.qty += difference;

  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }

  updateCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
  showToast('Removed from bag');
}

function applyPromo() {
  const code = (getElement('promoInput').value || '').trim().toUpperCase();
  let isSuccess = false; // <--- THIS IS THE MISSING LINE

  if (code === 'AURA10') {
    discount = 0.10;
    isSuccess = true;
    showToast('AURA10 applied — 10% off');
  } else if (code === 'RITUAL15') {
    discount = 0.15;
    isSuccess = true;
    showToast('RITUAL15 applied — 15% off');
  } else {
    discount = 0;
    showToast('Code not recognised — try AURA10');
  }

  // FORENSICS: Track Coupon Attempts
  window.dataLayer.push({
    'event': 'coupon_attempt',
    'coupon_code': code,
    'coupon_success': isSuccess
  });
  console.log(`Forensics: Coupon attempt: ${code}. Success: ${isSuccess}`);

  updateCart();
}


/* ============================================================
   06. DEMO CHECKOUT
   No real payment, order processing, or email is connected.
   ============================================================ */

function checkout() {
  if (!cart.length) {
    showToast('Your bag is empty');
    return;
  }

  const total = getElement('grandTotal').textContent;
  const orderNo = 'AURA' + Math.floor(
    10000 + Math.random() * 90000
  );

  cart = [];
  discount = 0;

  getElement('promoInput').value = '';

  updateCart();

  getElement('cartItems').innerHTML = `
    <div class="empty">
      <span style="font-size:42px">🌿</span>

      <b>Demo order completed!</b>

      Order #${orderNo} · ${total}

      <br>
      This is a website demonstration.
      No payment was collected and no real order was created.
    </div>
  `;

  showToast('Demo checkout complete — welcome to AURA');
}


/* ============================================================
   07. CART DRAWER & OVERLAY
   ============================================================ */

function openCart() {
  getElement('cartDrawer').classList.add('open');
  getElement('overlay').classList.add('show');

  document.body.style.overflow = 'hidden';

   const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  window.dataLayer.push({
    'event': 'cart_drawer_open',
    'cart_item_count': cartCount
  });
  console.log("Forensics: Cart drawer opened with", cartCount, "items");
}

function closeCart() {
  getElement('cartDrawer').classList.remove('open');

  syncOverlay();
   if (cart.length > 0) {
    const cartData = calculateCart();
    
    // Check if they are abandoning because they haven't hit free shipping
    const isShippingGap = cartData.subtotal < 999 && cartData.subtotal > 0;
    
    window.dataLayer.push({
      'event': 'cart_abandon_shipping',
      'cart_value': cartData.subtotal,
      'shipping_gap': isShippingGap ? (999 - cartData.subtotal) : 0,
      'hit_free_shipping': cartData.subtotal >= 999
    });
    console.log(`Forensics: Cart closed. Value: ₹${cartData.subtotal}. Shipping Gap: ${isShippingGap ? 'YES' : 'NO'}`);
}}

function syncOverlay() {
  const modalIds = [
    'cartDrawer',
    'quickModal',
    'searchModal',
    'quizModal'
  ];

  const anyOpen = modalIds.some((id) => {
    const element = getElement(id);

    return element.classList.contains(
      id === 'cartDrawer' ? 'open' : 'show'
    );
  });

  getElement('overlay').classList.toggle('show', anyOpen);

  document.body.style.overflow = anyOpen ? 'hidden' : '';
}

getElement('bagBtn').addEventListener('click', openCart);

getElement('overlay').addEventListener('click', () => {
  closeCart();
  closeQuick();
  closeSearch();
  closeQuiz();
});


/* ============================================================
   08. PRODUCT QUICK VIEW
   ============================================================ */

function openQuick(id) {
  const product = getProduct(id);

  if (!product) return;

   window.dataLayer.push({
    'event': 'quick_view_open',
    'product_id': product.id,
    'product_name': product.name
  });
  console.log("Forensics: Quick View opened for", product.name);

  qvId = id;
  qvQty = 1;

  getElement('qvImg').src = product.img;
  getElement('qvImg').alt = product.name;

  getElement('qvCat').textContent =
    `${product.cat} · ${product.badge}`;

  getElement('qvName').textContent = product.name;

  getElement('qvRating').innerHTML = `
    <b>${star()}</b>
    ${product.rating} ·
    ${product.reviews.toLocaleString('en-IN')} reviews
  `;

  getElement('qvDesc').textContent = product.desc;

  getElement('qvChips').innerHTML = product.chips
    .map((chip) => `<span class="chip">${chip}</span>`)
    .join('');

  getElement('qvPrice').innerHTML = `
    <s style="font-size:16px;color:#AAA296">
      ${inr(product.mrp)}
    </s>
    ${inr(product.price)}
  `;

  getElement('qvNotes').textContent = product.notes;
  getElement('qvQty').textContent = qvQty;

  getElement('quickModal').classList.add('show');

  syncOverlay();
}

function closeQuick() {
  getElement('quickModal').classList.remove('show');

  syncOverlay();
}

function changeQv(difference) {
  qvQty = Math.max(1, qvQty + difference);

  getElement('qvQty').textContent = qvQty;
}

getElement('qvAdd').addEventListener('click', () => {
  addToCart(qvId, qvQty, false);

  closeQuick();
  openCart();
});


/* ============================================================
   09. PRODUCT SEARCH
   ============================================================ */

function openSearch() {
  getElement('searchModal').classList.add('show');

  syncOverlay();
  renderSearch('');

  setTimeout(() => {
    const input = getElement('searchInput');

    if (input) {
      input.focus();
    }
  }, 100);
}

function closeSearch() {
  getElement('searchModal').classList.remove('show');

  syncOverlay();
}

function renderSearch(query = '') {
  const normalizedQuery = query.toLowerCase();

  const results = PRODUCTS.filter((product) => {
    const searchableText = [
      product.name,
      product.cat,
      product.desc,
      ...product.chips
    ].join(' ').toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  getElement('searchResults').innerHTML = results.length
    ? results.map((product) => `
        <button
          class="search-result"
          onclick="closeSearch(); openQuick(${product.id})"
        >
          <img src="${product.img}" alt="${product.name}">

          <span style="flex:1">
            <b class="serif">${product.name}</b>
            <br>

            <small style="color:var(--muted)">
              ${product.cat} · ${product.rating} ★
            </small>
          </span>

          <b>${inr(product.price)}</b>
        </button>
      `).join('')
    : `
        <p style="padding:20px;color:var(--muted)">
          No matches — try “serum” or “cream”.
        </p>
      `;
}

function quickSearch(term) {
  const input = getElement('searchInput');

  input.value = term;

  renderSearch(term);
}

getElement('searchBtn').addEventListener('click', openSearch);

getElement('searchInput').addEventListener('input', (event) => {
  renderSearch(event.target.value);
});

getElement('accountBtn').addEventListener('click', () => {
  showToast('Welcome back — accounts launch soon. Use AURA10 today!');
});


/* ============================================================
   10. SKINCARE RITUAL
   ============================================================ */

const RITUALS = [
  {
    step: 'Step 01 · Cleanse',
    title: 'Cleanse — Start fresh',
    short: 'Pure Balance Gentle Cleanser',
    desc: '60 seconds with lukewarm water. Massage, rinse, pat dry — never rub.',
    img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop',
    cap: 'Start fresh, gently.'
  },
  {
    step: 'Step 02 · Hydrate',
    title: 'Hydrate — Replenish your skin',
    short: 'Dew Drop Hydrating Serum',
    desc: '2–3 drops on damp skin. This is where the dewy, bouncy feeling begins.',
    img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=1000&auto=format&fit=crop',
    cap: 'Dew, delivered.'
  },
  {
    step: 'Step 03 · Moisturize',
    title: 'Moisturize — Complete your ritual',
    short: 'Cloud Nine Barrier Cream',
    desc: 'Seal everything in. Add SPF in the morning, face oil at night if you wish.',
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop',
    cap: 'Complete your daily ritual.'
  }
];

function renderRitual(active = 0) {
  const ritual = RITUALS[active];

  if (!ritual) return;

  getElement('ritualSteps').innerHTML = RITUALS
    .map((item, index) => `
      <button
        class="step ${index === active ? 'active' : ''}"
        onclick="renderRitual(${index})"
      >
        <span class="step-num">0${index + 1}</span>

        <span>
          <small>${item.step}</small>
          <h3>${item.title}</h3>

          <p>
            <b style="color:#282A25">${item.short}</b>
            — ${item.desc}
          </p>
        </span>
      </button>
    `)
    .join('');

  getElement('ritualImg').src = ritual.img;
  getElement('ritualTitle').textContent = ritual.cap;
  getElement('ritualDesc').textContent = ritual.desc;
}


/* ============================================================
   11. INGREDIENT EXPLORER
   ============================================================ */

const INGS = [
  {
    name: 'Hyaluronic Acid',
    desc: 'A hydration magnet that draws water into skin for a plump, dewy feel — without heaviness or stickiness.',
    pct: 96,
    img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Ceramides',
    desc: 'The building blocks of your barrier. They lock moisture in and keep irritants out for calm, resilient skin.',
    pct: 92,
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Niacinamide',
    desc: 'A multitasker for tone and texture. Helps visibly even skin, refine pores and support barrier health.',
    pct: 88,
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Squalane',
    desc: 'A skin-identical lipid that softens and smooths without clogging. The secret behind that supple finish.',
    pct: 90,
    img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop'
  }
];

function renderIng() {
  getElement('ingPills').innerHTML = INGS
    .map((ingredient, index) => `
      <button
        class="ing-pill ${index === ingIdx ? 'active' : ''}"
        onclick="setIngredient(${index})"
      >
        ${ingredient.name}
      </button>
    `)
    .join('');

  const ingredient = INGS[ingIdx];

  getElement('ingName').textContent = ingredient.name;
  getElement('ingDesc').textContent = ingredient.desc;
  getElement('ingPct').textContent = `${ingredient.pct}%`;
  getElement('ingImg').src = ingredient.img;

  const bar = getElement('ingBar');

  bar.style.width = '0%';

  requestAnimationFrame(() => {
    setTimeout(() => {
      bar.style.width = `${ingredient.pct}%`;
    }, 60);
  });
}

function setIngredient(index) {
  if (!INGS[index]) return;

  ingIdx = index;

  renderIng();

  const ingredientName = INGS[index].name;
  
  window.dataLayer.push({
    'event': 'ingredient_click',
    'ingredient_name': ingredientName
  });
  
  console.log("Forensics: Ingredient tracked:", ingredientName);
}



/* ============================================================
   12. CUSTOMER REVIEWS
   ============================================================ */

const REVIEWS = [
  {
    n: 'Ananya S.',
    c: 'Mumbai · Verified Buyer',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    t: '“My skin finally feels calm. The Dew Drop Serum is the first product I’ve finished to the last drop.”',
    p: 'Dew Drop Serum'
  },
  {
    n: 'Priya K.',
    c: 'Bengaluru · Verified Buyer',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    t: '“Cloud Nine is exactly that. No grease, no perfume cloud — just soft skin all day, even in AC.”',
    p: 'Cloud Nine Cream'
  },
  {
    n: 'Meera R.',
    c: 'Delhi · Verified Buyer',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop',
    t: '“I replaced a 7-step routine with AURA’s three. My skin looks better and my mornings are mine again.”',
    p: 'Complete Ritual Set'
  },
  {
    n: 'Kavya D.',
    c: 'Hyderabad · Verified Buyer',
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=100&auto=format&fit=crop',
    t: '“The cleanser removes SPF without that tight feeling. It’s gentle but it actually works.”',
    p: 'Pure Balance Cleanser'
  },
  {
    n: 'Ishita M.',
    c: 'Pune · Verified Buyer',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=100&auto=format&fit=crop',
    t: '“Packaging, texture, results — everything feels premium. This is my third repurchase already.”',
    p: 'Midnight Renewal Oil'
  }
];

getElement('revTrack').innerHTML = REVIEWS
  .map((review) => `
    <div class="rev-card">
      <div class="stars">${star()}</div>

      <p>${review.t}</p>

      <div class="person">
        <img src="${review.img}" alt="${review.n}">

        <div>
          <b>${review.n}</b>
          <span>${review.c}</span>
          <br>

          <small style="color:var(--sage2);font-weight:600">
            Purchased: ${review.p}
          </small>
        </div>
      </div>
    </div>
  `)
  .join('');

function revMax() {
  const visibleCards = window.innerWidth < 600
    ? 1
    : window.innerWidth < 980
      ? 2
      : 3;

  return Math.max(0, REVIEWS.length - visibleCards);
}

function moveRev(difference) {
  revIndex = Math.max(
    0,
    Math.min(revMax(), revIndex + difference)
  );

  const firstCard = document.querySelector('.rev-card');

  const cardWidth = firstCard
    ? firstCard.getBoundingClientRect().width + 18
    : 340;

  getElement('revTrack').style.transform =
    `translateX(-${revIndex * cardWidth}px)`;
}

setInterval(() => {
  if (document.hidden) return;

  revIndex = revIndex >= revMax() ? 0 : revIndex + 1;

  moveRev(0);
}, 5000);

window.addEventListener('resize', () => {
  revIndex = Math.min(revIndex, revMax());

  moveRev(0);
});


/* ============================================================
   13. FAQ ACCORDION
   ============================================================ */

const FAQS = [
  [
    'Is AURA suitable for sensitive skin?',
    'Yes. All formulas are pH-balanced, dermatologist tested and made without harsh fragrance. We still recommend a patch test for very reactive skin.'
  ],
  [
    'How long until I see results?',
    'Hydration is often felt immediately. Visible tone and texture improvements typically appear with consistent use in 3–4 weeks.'
  ],
  [
    'What is your return policy?',
    '30-day easy returns, even if opened. If your skin doesn’t love it, we’ll make it right.'
  ],
  [
    'Do you offer Cash on Delivery?',
    'Yes — COD is available across India, along with UPI, cards and net banking. Free shipping over ₹999.'
  ]
];

getElement('faq').innerHTML = FAQS
  .map((faq, index) => `
    <div class="faq-item ${index === 0 ? 'open' : ''}">
      <button
        class="faq-q"
        onclick="toggleFaq(this)"
        aria-expanded="${index === 0}"
      >
        <span>${faq[0]}</span>
        <span>+</span>
      </button>

      <div class="faq-a">${faq[1]}</div>
    </div>
  `)
  .join('');

function toggleFaq(button) {
  const item = button.parentElement;
  const isOpen = item.classList.toggle('open');

  button.setAttribute('aria-expanded', String(isOpen));
   if (isOpen) {
    const questionText = button.querySelector('span').innerText;
    window.dataLayer.push({
      'event': 'faq_expand',
      'faq_question': questionText
    });
    console.log("Forensics: FAQ expanded:", questionText);
  }
}



/* ============================================================
   14. SKIN QUIZ
   ============================================================ */

const QUIZ = [
  {
    q: 'How does your skin usually feel?',
    opts: [
      'Dry & tight',
      'Oily / combination',
      'Sensitive & reactive',
      'Pretty balanced'
    ]
  },
  {
    q: 'Your main skin wish right now?',
    opts: [
      'Deep hydration',
      'Calm & barrier repair',
      'Glow & even tone',
      'Gentle daily cleansing'
    ]
  },
  {
    q: 'How do you like your textures?',
    opts: [
      'Lightweight & watery',
      'Rich & comforting',
      'Anything simple',
      'Depends on the day'
    ]
  }
];

function openQuiz() {
  quizStep = 0;
  quizAns = [];

  closeMobileMenu();

  getElement('quizModal').classList.add('show');

  syncOverlay();
  renderQuiz();

   window.dataLayer.push({
    'event': 'quiz_start'
  });
  console.log("Forensics: Quiz started.");
}

function closeQuiz() {
  getElement('quizModal').classList.remove('show');

  syncOverlay();
}

function renderQuiz() {
  const body = getElement('quizBody');

  getElement('quizBar').style.width =
    `${((quizStep + 1) / (QUIZ.length + 1)) * 100}%`;

  if (quizStep < QUIZ.length) {
    const question = QUIZ[quizStep];

    body.innerHTML = `
      <p class="eyebrow">
        Question ${quizStep + 1} of ${QUIZ.length}
      </p>

      <h3 class="serif" style="font-size:26px;margin:8px 0 6px">
        ${question.q}
      </h3>

      ${question.opts.map((option, index) => `
        <button
          class="quiz-opt"
          onclick="answerQuiz(${index})"
        >
          ${option}
          <span style="float:right">→</span>
        </button>
      `).join('')}
    `;

    return;
  }

  const recommendation = getQuizRecommendation();
  window.dataLayer.push({
  'event': 'quiz_complete',
  'recommended_product': recommendation.name,
  'recommended_price': recommendation.price
});
console.log("Forensics: Quiz completed. Recommended:", recommendation.name);

  body.innerHTML = `
    <p class="eyebrow">Your ritual match</p>

    <h3 class="serif" style="font-size:28px;margin:8px 0">
      Start with ${recommendation.name}
    </h3>

    <button
      class="search-result"
      onclick="closeQuiz(); openQuick(${recommendation.id})"
    >
      <img src="${recommendation.img}" alt="${recommendation.name}">

      <span style="flex:1">
        <b class="serif">${recommendation.name}</b>
        <br>

        <small style="color:var(--muted)">
          ${recommendation.desc}
        </small>
      </span>

      <b>${inr(recommendation.price)}</b>
    </button>

    <button
      class="btn btn-dark"
      style="width:100%;justify-content:center;margin-top:14px"
      onclick="addToCart(${recommendation.id},1,false);closeQuiz();openCart()"
    >
      Add My Match — ${inr(recommendation.price)}
    </button>

    <button
      class="quiz-opt"
      style="text-align:center"
      onclick="quizStep=0;quizAns=[];renderQuiz()"
    >
      Retake quiz
    </button>
  `;

  getElement('quizBar').style.width = '100%';
}

function getQuizRecommendation() {
  const mainWish = quizAns[1];

  if (mainWish === 1) return PRODUCTS[1];
  if (mainWish === 2) return PRODUCTS[5];
  if (mainWish === 3) return PRODUCTS[2];

  return PRODUCTS[0];
}

function answerQuiz(index) {
  quizAns.push(index);

  quizStep += 1;

  renderQuiz();
}


/* ============================================================
   15. ANNOUNCEMENT BAR & MARQUEE
   ============================================================ */

const messages = [
  'Your daily ritual, delivered with care — Free shipping over ₹999',
  'Use code AURA10 for 10% off your first order',
  'New: Midnight Renewal Oil has arrived ✦ Shop now'
];

let messageIndex = 0;

setInterval(() => {
  if (document.hidden) return;

  messageIndex = (messageIndex + 1) % messages.length;

  const announcement = getElement('announceText');

  announcement.style.opacity = 0;

  setTimeout(() => {
    announcement.textContent = `✦ ${messages[messageIndex]}`;
    announcement.style.opacity = 1;
  }, 350);
}, 4200);

const marqueeContent = `
  <span>Clean Formulas</span><i>✦</i>
  <span>Vegan & Cruelty-Free</span><i>✦</i>
  <span>Dermatologist Tested</span><i>✦</i>
  <span>Refillable Glass</span><i>✦</i>
  <span>Made in India</span><i>✦</i>
  <span>No Harsh Fragrance</span><i>✦</i>
`;

getElement('marquee').innerHTML =
  Array(2).fill(marqueeContent).join('');


/* ============================================================
   16. HEADER & MOBILE NAVIGATION
   ============================================================ */

window.addEventListener('scroll', () => {
  getElement('header').classList.toggle(
    'scrolled',
    window.scrollY > 10
  );
}, { passive: true });

function closeMobileMenu() {
  getElement('mobileMenu').classList.remove('open');

  document.body.style.overflow = '';
}

getElement('hamburger').addEventListener('click', () => {
  getElement('mobileMenu').classList.add('open');

  document.body.style.overflow = 'hidden';
});

getElement('closeMobile').addEventListener(
  'click',
  closeMobileMenu
);

document.querySelectorAll('#mobileMenu a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});


/* ============================================================
   17. NEWSLETTER FORM
   Demo only: no email service or mailing list is connected.
   ============================================================ */

getElement('newsForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const input = getElement('newsEmail');
  const email = (input.value || '').trim();

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  if (!validEmail) {
    showToast('Please enter a valid email');

    input.focus();

    return;
  }

  showToast('Demo signup complete — email service not connected');

  event.target.reset();
});


/* ============================================================
   18. TOAST NOTIFICATIONS
   ============================================================ */

function showToast(message) {
  getElement('toastText').textContent = message;

  getElement('toast').classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    getElement('toast').classList.remove('show');
  }, 2800);
}


/* ============================================================
   19. SCROLL REVEAL ANIMATIONS
   ============================================================ */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('in');

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});


/* ============================================================
   20. KEYBOARD SHORTCUTS
   ============================================================ */

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  closeCart();
  closeQuick();
  closeSearch();
  closeQuiz();
  closeMobileMenu();
});


/* ============================================================
   21. INITIALIZATION
   Ensure script.js is loaded with defer in index.html.
   ============================================================ */

function initAura() {
  renderProducts();
  renderRitual(0);
  renderIng();
  updateCart();
}

initAura();

/* ======================== END script.js ===================== */


// tracking steup

// 1. Hero Scroll Tracker (The Attention Span)
const heroStartTime = Date.now();
let heroScrolled = false;

window.addEventListener('scroll', () => {
    
  if (window.scrollY > 600 && !heroScrolled) {
        heroScrolled = true;
        
        const timeToScroll = (Date.now() - heroStartTime) / 1000;
        
        window.dataLayer.push({
            'event': 'scroll_hero_passed',
            'time_to_scroll_seconds': timeToScroll,
            'user_type': timeToScroll < 3 ? 'Hunter' : 'Romantic'
        });
        
        console.log(`Forensics: User scrolled past hero in ${timeToScroll} seconds. Type: ${timeToScroll < 3 ? 'Hunter' : 'Romantic'}`);
    }
});

// FORENSICS: Exit Intent Tracker
document.addEventListener('mouseleave', (e) => {
  if (e.clientY < 0) {
    window.dataLayer.push({
      'event': 'exit_intent',
      'page_location': window.location.href
    });
    console.log("Forensics: Exit intent detected.");
  }
});

/* ============================================================
   FORENSICS: Bestseller Hover (Psychological Hesitation)
   ============================================================ */

document.querySelectorAll('.card').forEach(card => {
  let hoverTimer;
  let isTracked = false;

  card.addEventListener('mouseenter', () => {
    // Start a 3-second timer when the mouse enters the card
    hoverTimer = setTimeout(() => {
      if (!isTracked) {
        const productName = card.getAttribute('data-product-name');
        
        window.dataLayer.push({
          'event': 'bestseller_hover',
          'product_names': productName,
          'hesitation_time_ms': 3000
        });
        
        console.log("Forensics: Hesitation tracked for", productName);
        isTracked = true; // Prevent firing multiple times
      }
    }, 3000);
  });

  card.addEventListener('mouseleave', () => {
    // Clear the timer if the mouse leaves before 3 seconds
    clearTimeout(hoverTimer);
  });
});