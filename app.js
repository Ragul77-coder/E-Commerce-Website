// Cart Management State
let cart = JSON.parse(localStorage.getItem('shop_cart'));
if (!cart) {
  cart = [
    {
      id: "home-chair",
      name: "Bouclé Lounge Chair",
      brand: "Atelier Nord",
      price: 890,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&h=600&q=80",
      quantity: 1
    },
    {
      id: "beauty-mist",
      name: "Rose Botanica Facial Mist",
      brand: "Soma Hydration",
      price: 34,
      image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&h=600&q=80",
      quantity: 2
    }
  ];
  localStorage.setItem('shop_cart', JSON.stringify(cart));
}

// Mock Auth State (for Demo Mode when Clerk is not configured)
let mockUser = JSON.parse(localStorage.getItem('shop_mock_user')) || null;

// Auth Provider State
let isDemoMode = true;
let clerkInstance = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Main App Initialization
async function initApp() {
  // 1. Initialize Auth System
  await initAuth();

  // 2. Setup Shared Elements (Sidebar, Header, Banners, Cookies)
  setupSharedUI();

  // 3. Render Page Specific Content
  renderPageContent();

  // 4. Update Cart Badge
  updateCartBadge();
}

// ==========================================
// Authentication & Clerk Integration
// ==========================================
async function initAuth() {
  const key = window.CONFIG?.CLERK_PUBLISHABLE_KEY || "";
  
  // Activate true Clerk if key is provided and is not a placeholder
  if (key && key.trim() !== "" && !key.includes("YOUR_CLERK_PUBLISHABLE_KEY")) {
    isDemoMode = false;
    try {
      if (typeof window.Clerk === 'undefined') {
        await loadClerkSDK(key);
      }
      await window.Clerk.load({
        ui: { ClerkUI: window.__internal_ClerkUICtor }
      });
      clerkInstance = window.Clerk;
      console.log("Clerk authentication successfully loaded.");
    } catch (err) {
      console.error("Clerk load failed. Fallback to Demo Mode.", err);
      isDemoMode = true;
    }
  } else {
    isDemoMode = true;
    console.log("Running in Demo Mode (Clerk publishable key not configured).");
  }
}

function loadClerkSDK(publishableKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const b64Part = publishableKey.split('_')[2];
      const clerkDomain = atob(b64Part).slice(0, -1);
      
      // 1. Load the Clerk UI bundle
      await new Promise((res, rej) => {
        const scriptUI = document.createElement('script');
        scriptUI.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`;
        scriptUI.async = true;
        scriptUI.crossOrigin = 'anonymous';
        scriptUI.onload = res;
        scriptUI.onerror = () => rej(new Error('Failed to load @clerk/ui bundle'));
        document.head.appendChild(scriptUI);
      });

      // 2. Load the Clerk JS SDK
      await new Promise((res, rej) => {
        const scriptJS = document.createElement('script');
        scriptJS.src = `https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`;
        scriptJS.async = true;
        scriptJS.crossOrigin = 'anonymous';
        scriptJS.setAttribute('data-clerk-publishable-key', publishableKey);
        scriptJS.onload = res;
        scriptJS.onerror = () => rej(new Error('Failed to load @clerk/clerk-js bundle'));
        document.head.appendChild(scriptJS);
      });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

// Check if user is authenticated
function isAuthenticated() {
  if (isDemoMode) {
    return mockUser !== null;
  } else {
    return clerkInstance?.user !== null;
  }
}

// Get user details
function getUserInfo() {
  if (isDemoMode) {
    return mockUser;
  } else {
    if (clerkInstance && clerkInstance.user) {
      return {
        fullName: clerkInstance.user.fullName || clerkInstance.user.username,
        imageUrl: clerkInstance.user.imageUrl,
        email: clerkInstance.user.primaryEmailAddress?.emailAddress
      };
    }
    return null;
  }
}

// Trigger login flow
function triggerLogin() {
  if (isDemoMode) {
    showGoogleLoginModal();
  } else {
    if (clerkInstance) {
      clerkInstance.openSignIn({
        afterSignInUrl: window.location.href,
        afterSignUpUrl: window.location.href
      });
    }
  }
}

// Show custom simulated Google Sign-In modal in Demo Mode
function showGoogleLoginModal() {
  // Remove existing modal if any
  const existing = document.querySelector('.google-auth-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'google-auth-overlay';
  
  overlay.innerHTML = `
    <div class="google-auth-card">
      <div class="google-brand">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span style="font-family: 'Product Sans', sans-serif; font-size: 22px; font-weight: bold; color: #5f6368; letter-spacing: -0.5px;">Google</span>
      </div>
      
      <div class="google-auth-content" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
        <h2 class="google-auth-title">Sign in</h2>
        <p class="google-auth-subtitle">to continue to shop.</p>
        
        <div class="google-accounts-list">
          <div class="google-account-item" data-email="ragul77@gmail.com" data-name="Ragul Coder" data-image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" class="google-account-avatar" alt="Ragul Coder">
            <div class="google-account-info">
              <span class="google-account-name">Ragul Coder</span>
              <span class="google-account-email">ragul77@gmail.com</span>
            </div>
          </div>
          <div class="google-account-item" data-email="guest.dev@gmail.com" data-name="Guest Developer" data-image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" class="google-account-avatar" alt="Guest Developer">
            <div class="google-account-info">
              <span class="google-account-name">Guest Developer</span>
              <span class="google-account-email">guest.dev@gmail.com</span>
            </div>
          </div>
        </div>
        
        <p class="google-auth-footer">
          To continue, Google will share your name, email address, language preference, and profile picture with shop.
        </p>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Animate in
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
  
  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeGoogleModal(overlay);
    }
  });
  
  // Handle account selection
  overlay.querySelectorAll('.google-account-item').forEach(item => {
    item.addEventListener('click', () => {
      const email = item.getAttribute('data-email');
      const name = item.getAttribute('data-name');
      const image = item.getAttribute('data-image');
      
      selectGoogleAccount(overlay, { fullName: name, email: email, imageUrl: image });
    });
  });
}

function closeGoogleModal(overlay) {
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.remove();
  }, 300);
}

function selectGoogleAccount(overlay, user) {
  const content = overlay.querySelector('.google-auth-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="google-auth-loader">
      <div class="google-spinner"></div>
      <div style="font-size: 14px; color: #202124; font-weight: 500;">Signing you in...</div>
      <div style="font-size: 12px; color: #5f6368; margin-top: 4px;">Connecting to shop.</div>
    </div>
  `;
  
  setTimeout(() => {
    localStorage.setItem('shop_mock_user', JSON.stringify(user));
    mockUser = user;
    
    closeGoogleModal(overlay);
    showToast(`Welcome back, ${user.fullName}!`);
    
    setTimeout(() => {
      location.reload();
    }, 800);
  }, 1500);
}

// Trigger logout flow
function triggerLogout() {
  if (isDemoMode) {
    localStorage.removeItem('shop_mock_user');
    mockUser = null;
    location.reload();
  } else {
    if (clerkInstance) {
      clerkInstance.signOut().then(() => {
        location.reload();
      });
    }
  }
}

// ==========================================
// Cart System
// ==========================================
function addToCart(productId, quantity = 1, showNotification = true) {
  const product = window.products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart();
  updateCartBadge();
  
  if (showNotification) {
    showToast(`${product.name} added to cart!`);
  }
}

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartBadge();
    
    // If we are on the cart page, re-render
    if (document.getElementById('cart-items-wrapper')) {
      renderCartPage();
    }
  }
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const itemName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    saveCart();
    updateCartBadge();
    showToast(`${itemName} removed from cart.`);
    
    // If we are on the cart page, re-render
    if (document.getElementById('cart-items-wrapper')) {
      renderCartPage();
    }
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('shop_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '32px';
    toastContainer.style.right = '32px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '8px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.backgroundColor = 'var(--color-ink-black)';
  toast.style.color = 'var(--color-pure-white)';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = 'var(--radius-pills)';
  toast.style.fontSize = 'var(--text-body)';
  toast.style.boxShadow = 'var(--shadow-lg)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Remove toast
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ==========================================
// Shared UI Setup (Sidebar, Banners, Cookie)
// ==========================================
function setupSharedUI() {
  // 1. Sidebar profile photo and auth triggers
  const profileContainer = document.querySelector('.sidebar-profile');
  if (profileContainer) {
    if (!isDemoMode && clerkInstance) {
      if (clerkInstance.user) {
        // Mount Clerk UserButton which shows photo and handles logout
        clerkInstance.mountUserButton(profileContainer);
      } else {
        profileContainer.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>`;
        profileContainer.addEventListener('click', triggerLogin);
      }
    } else {
      // Demo Mode rendering
      const user = getUserInfo();
      if (user) {
        profileContainer.innerHTML = `<img src="${user.imageUrl}" alt="${user.fullName}" title="Logged in as ${user.fullName} (Click to Logout)">`;
        profileContainer.addEventListener('click', () => {
          if (confirm(`Do you want to log out of ${user.fullName}?`)) {
            triggerLogout();
          }
        });
      } else {
        profileContainer.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>`;
        profileContainer.addEventListener('click', triggerLogin);
      }
    }
  }

  // 2. Cookie consent banner
  const hasAcceptedCookies = localStorage.getItem('shop_cookies_accepted');
  if (!hasAcceptedCookies) {
    showCookieBanner();
  }
}

function showCookieBanner() {
  const banner = document.createElement('div');
  banner.className = 'cookie-consent-banner';
  banner.innerHTML = `
    <div class="cookie-text">
      We use cookies to enhance your shopping experience on our white-canvas catalog. By continuing, you agree to our cookie policy. Read our <a class="cookie-link" href="#">Cookie Policy</a>.
    </div>
    <div class="cookie-actions">
      <button class="cookie-accept-btn" id="accept-cookies-btn">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('accept-cookies-btn')?.addEventListener('click', () => {
    localStorage.setItem('shop_cookies_accepted', 'true');
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(() => banner.remove(), 300);
  });
}

// ==========================================
// Page Specific Rendering Routing
// ==========================================
function renderPageContent() {
  const currentPath = window.location.pathname;
  
  if (document.getElementById('constellation-wrapper')) {
    renderLandingPage();
  } else if (document.getElementById('product-detail-container')) {
    renderProductDetailPage();
  } else if (document.getElementById('cart-items-wrapper')) {
    renderCartPage();
  } else if (document.getElementById('checkout-form-container')) {
    renderCheckoutPage();
  } else if (document.getElementById('success-summary-container')) {
    renderSuccessPage();
  } else if (document.getElementById('clerk-signin-container')) {
    renderLoginPage();
  }
}

// ==========================================
// Landing Page Logic (index.html)
// ==========================================
function renderLandingPage() {
  // 1. Render Floating Constellation
  const constellationContainer = document.getElementById('constellation-wrapper');
  const heroProducts = window.products.filter(p => p.isHero).slice(0, 4);
  const positionClasses = ['pos-left', 'pos-center-left', 'pos-center-right', 'pos-right'];

  if (constellationContainer) {
    constellationContainer.innerHTML = '';
    heroProducts.forEach((prod, index) => {
      const card = document.createElement('div');
      card.className = `constellation-card ${positionClasses[index]}`;
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${prod.image}" alt="${prod.name}">
        </div>
        <div class="card-info">
          <div class="brand-name">${prod.brand}</div>
          <div class="rating-row">
            <span class="rating-stars">★ ${prod.rating}</span>
            <span>(${prod.reviewCount})</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `product.html?id=${prod.id}`;
      });
      constellationContainer.appendChild(card);
    });
  }

  // 2. Render Categories Pills Filter
  const categories = ['All', 'Women', 'Men', 'Beauty', 'Home', 'Baby & Toddler'];
  const pillsContainer = document.getElementById('category-pills-container');
  if (pillsContainer) {
    pillsContainer.innerHTML = '';
    categories.forEach(cat => {
      const pill = document.createElement('div');
      pill.className = `category-pill ${cat === 'All' ? 'active' : ''}`;
      pill.setAttribute('data-category', cat);
      
      const emojiMap = {
        'All': '✨',
        'Women': '👗',
        'Men': '👞',
        'Beauty': '🧴',
        'Home': '🪴',
        'Baby & Toddler': '🧸'
      };

      pill.innerHTML = `
        <div class="category-pill-icon" style="background-color: var(--color-canvas-mist);">${emojiMap[cat] || '📦'}</div>
        <span class="category-pill-label">${cat}</span>
      `;
      
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterProducts(cat);
      });
      pillsContainer.appendChild(pill);
    });
  }

  // 3. Render Product Sections
  renderStorefrontProducts(window.products);

  // 4. Setup Search Listener
  const searchInput = document.getElementById('shop-search-input');
  const searchBtn = document.getElementById('shop-search-btn');

  const executeSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query !== "") {
      const filtered = window.products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
      renderStorefrontProducts(filtered, `Search results for "${searchInput.value}"`);
      
      // Scroll smoothly to section
      document.getElementById('store-sections')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      renderStorefrontProducts(window.products);
    }
  };

  searchBtn?.addEventListener('click', executeSearch);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });
}

function filterProducts(category) {
  const storeSections = document.getElementById('store-sections');
  if (!storeSections) return;

  if (category === 'All') {
    renderStorefrontProducts(window.products);
  } else {
    const filtered = window.products.filter(p => p.category === category);
    renderStorefrontProducts(filtered, category);
  }
}

function renderStorefrontProducts(productsList, specificTitle = null) {
  const storeSections = document.getElementById('store-sections');
  if (!storeSections) return;
  storeSections.innerHTML = '';

  if (productsList.length === 0) {
    storeSections.innerHTML = `
      <div style="text-align: center; padding: 64px 0; color: var(--color-muted-gray);">
        <h3>No products found matching your search.</h3>
        <p style="margin-top: 12px;">Try searching for other keywords like "Chair", "Linen" or "Mist".</p>
      </div>
    `;
    return;
  }

  // Group by category if we are viewing "All", otherwise render a single category
  if (specificTitle) {
    const section = createProductSection(specificTitle, productsList);
    storeSections.appendChild(section);
  } else {
    const categories = [...new Set(productsList.map(p => p.category))];
    categories.forEach(cat => {
      const catProducts = productsList.filter(p => p.category === cat);
      const section = createProductSection(cat, catProducts);
      storeSections.appendChild(section);
    });
  }
}

function createProductSection(title, list) {
  const section = document.createElement('section');
  section.className = 'category-section';

  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <h2 class="category-title">${title}</h2>
    <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  `;

  const grid = document.createElement('div');
  
  // Decide layout composition: 
  // Let's make the first section have a 2-column composition (Wide Hero tile + grid)
  // Others use 4-column standard grid
  const hasHeroTile = list.length >= 3 && (title === 'Home' || title === 'Women');
  
  if (hasHeroTile) {
    grid.className = 'product-grid composition-2';
    
    // Pick the first item as a Wide product hero tile
    const heroProd = list[0];
    const subList = list.slice(1);

    const heroTile = document.createElement('div');
    heroTile.className = 'product-hero-tile';
    heroTile.style.backgroundImage = `url('${heroProd.image}')`;
    heroTile.innerHTML = `
      <div class="product-hero-content">
        <div class="product-hero-brand">${heroProd.brand}</div>
        <div class="product-hero-details">
          <div class="product-hero-title">${heroProd.name} — $${heroProd.price}</div>
          <div class="product-hero-rating">★ ${heroProd.rating} (${heroProd.reviewCount} reviews)</div>
        </div>
      </div>
    `;
    heroTile.addEventListener('click', () => {
      window.location.href = `product.html?id=${heroProd.id}`;
    });
    grid.appendChild(heroTile);

    // Add rest of products
    subList.forEach(prod => {
      const card = createProductCard(prod);
      grid.appendChild(card);
    });

  } else {
    grid.className = 'product-grid';
    list.forEach(prod => {
      const card = createProductCard(prod);
      grid.appendChild(card);
    });
  }

  section.appendChild(header);
  section.appendChild(grid);
  return section;
}

function createProductCard(prod) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  let thumbnailsHTML = '';
  if (prod.thumbnails && prod.thumbnails.length > 0) {
    thumbnailsHTML = `<div class="product-card-thumbnails">`;
    prod.thumbnails.slice(0, 3).forEach(thumb => {
      thumbnailsHTML += `
        <div class="thumbnail-swatch" data-thumb="${thumb}">
          <img src="${thumb}" alt="${prod.name}">
        </div>
      `;
    });
    thumbnailsHTML += `</div>`;
  }

  card.innerHTML = `
    <div class="product-card-img-wrapper">
      <img src="${prod.image}" class="product-card-img" alt="${prod.name}">
    </div>
    ${thumbnailsHTML}
    <div class="product-card-body">
      <div class="product-card-brand">${prod.brand}</div>
      <div class="product-card-title">${prod.name}</div>
      <div class="product-card-meta">
        <div class="product-card-price">$${prod.price}</div>
        <div class="product-card-rating">
          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          <span>${prod.rating}</span>
        </div>
      </div>
    </div>
  `;

  // Attach navigation click
  card.addEventListener('click', (e) => {
    // Avoid redirect if clicked on swatches
    if (e.target.closest('.thumbnail-swatch')) {
      const swatch = e.target.closest('.thumbnail-swatch');
      const bigImg = card.querySelector('.product-card-img');
      if (bigImg) {
        bigImg.src = swatch.getAttribute('data-thumb');
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    window.location.href = `product.html?id=${prod.id}`;
  });

  return card;
}

// ==========================================
// Product Details Page Logic (product.html)
// ==========================================
function renderProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = window.products.find(p => p.id === productId);

  const container = document.getElementById('product-detail-container');
  if (!container) return;

  if (!product) {
    container.innerHTML = `
      <div style="text-align: center; padding: 64px 0; color: var(--color-muted-gray);">
        <h3>Product not found</h3>
        <a href="index.html" class="shop-now-btn">Back to Home</a>
      </div>
    `;
    return;
  }

  // Render Page Content
  let thumbnailsHTML = '';
  product.thumbnails.forEach((thumb, idx) => {
    thumbnailsHTML += `
      <div class="gallery-thumbnail ${idx === 0 ? 'active' : ''}" data-url="${thumb}">
        <img src="${thumb}" alt="${product.name}">
      </div>
    `;
  });

  let specsHTML = '';
  for (const [key, value] of Object.entries(product.details)) {
    specsHTML += `
      <div class="spec-row">
        <span class="spec-label">${key}</span>
        <span class="spec-value">${value}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="product-detail-layout">
      <!-- Gallery Column -->
      <div class="detail-gallery">
        <div class="main-image-wrapper">
          <img id="main-product-img" src="${product.image}" alt="${product.name}">
        </div>
        <div class="gallery-thumbnails">
          ${thumbnailsHTML}
        </div>
      </div>

      <!-- Info Column -->
      <div class="detail-info">
        <div>
          <div class="detail-brand">${product.brand}</div>
          <h1 class="detail-title">${product.name}</h1>
        </div>

        <div class="detail-rating">
          <span class="stars">★★★★★</span>
          <span>${product.rating} (${product.reviewCount} customer reviews)</span>
        </div>

        <div class="detail-price">$${product.price}</div>

        <p class="detail-description">${product.description}</p>

        <div class="detail-specs">
          ${specsHTML}
        </div>

        <button class="add-to-cart-btn" id="add-to-cart-action">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  `;

  // Attach Thumbnail Click Actions
  const thumbs = container.querySelectorAll('.gallery-thumbnail');
  const mainImg = container.querySelector('#main-product-img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.getAttribute('data-url');
    });
  });

  // Attach Add to Cart Button Action
  const btn = container.querySelector('#add-to-cart-action');
  btn.addEventListener('click', () => {
    addToCart(product.id, 1);
    
    // Animate Add to Cart
    btn.style.backgroundColor = '#10b981';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      Added!
    `;

    setTimeout(() => {
      btn.style.backgroundColor = 'var(--color-shop-violet)';
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        Add to Cart
      `;
    }, 1500);
  });

  // Render "You May Also Like" Related Products
  renderRelatedProducts(product);
}

function renderRelatedProducts(currProduct) {
  const relatedWrapper = document.getElementById('related-products-wrapper');
  if (!relatedWrapper) return;

  const related = window.products
    .filter(p => p.category === currProduct.category && p.id !== currProduct.id)
    .slice(0, 3);

  relatedWrapper.innerHTML = '';
  
  if (related.length === 0) {
    // Grab general featured items instead
    const alternatives = window.products.filter(p => p.id !== currProduct.id).slice(0, 3);
    alternatives.forEach(p => {
      relatedWrapper.appendChild(createProductCard(p));
    });
  } else {
    related.forEach(p => {
      relatedWrapper.appendChild(createProductCard(p));
    });
  }
}

// ==========================================
// Cart Page Logic (cart.html)
// ==========================================
function renderCartPage() {
  const wrapper = document.getElementById('cart-items-wrapper');
  const summaryWrapper = document.getElementById('cart-summary-wrapper');
  if (!wrapper || !summaryWrapper) return;

  if (cart.length === 0) {
    wrapper.innerHTML = `
      <div class="empty-cart-state" style="grid-column: span 2;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 class="empty-title">Your shopping cart is empty</h2>
        <p class="empty-text">Explore our pillow-soft collection to add featured products here.</p>
        <a href="index.html" class="shop-now-btn">Start Browsing</a>
      </div>
    `;
    summaryWrapper.style.display = 'none';
    return;
  }

  // Show summary panel
  summaryWrapper.style.display = 'flex';

  // Render cart items
  wrapper.innerHTML = '';
  cart.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item';
    itemCard.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <span class="cart-item-brand">${item.brand}</span>
        <h3 class="cart-item-title">${item.name}</h3>
        <span class="cart-item-price">$${item.price}</span>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controller">
          <button class="quantity-btn dec-btn" data-id="${item.id}">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn inc-btn" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item-btn" data-id="${item.id}">
          <svg viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    `;
    wrapper.appendChild(itemCard);
  });

  // Calculate subtotals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08); // 8% sales tax
  const grandTotal = subtotal + shipping + tax;

  summaryWrapper.innerHTML = `
    <div class="cart-summary">
      <h2 class="summary-title">Summary</h2>
      <div class="summary-rows">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
          <span>Estimated Shipping</span>
          <span>${shipping === 0 ? 'Free' : `$${shipping}`}</span>
        </div>
        <div class="summary-row">
          <span>Tax (8%)</span>
          <span>$${tax}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span>$${grandTotal}</span>
        </div>
      </div>
      <button class="checkout-btn" id="proceed-checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  `;

  // Attach controls listeners
  wrapper.querySelectorAll('.dec-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), -1));
  });
  wrapper.querySelectorAll('.inc-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), 1));
  });
  wrapper.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
  });

  // Proceed to checkout button action
  document.getElementById('proceed-checkout-btn')?.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}

// ==========================================
// Checkout Page Logic (checkout.html)
// ==========================================
function renderCheckoutPage() {
  const formContainer = document.getElementById('checkout-form-container');
  const summaryContainer = document.getElementById('checkout-summary-container');
  if (!formContainer || !summaryContainer) return;

  if (cart.length === 0) {
    formContainer.innerHTML = `
      <div class="auth-lock-card" style="grid-column: span 2;">
        <h2>Your cart is empty</h2>
        <a href="index.html" class="shop-now-btn">Return to Home</a>
      </div>
    `;
    summaryContainer.style.display = 'none';
    return;
  }

  // 1. Force Login Check
  if (!isAuthenticated()) {
    formContainer.innerHTML = `
      <div class="auth-lock-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <h2 class="auth-lock-title">Sign in to checkout</h2>
        <p class="auth-lock-text">To secure your transaction details and track order history, please sign in with Google.</p>
        <button class="clerk-login-btn" id="checkout-login-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.853-6.357-6.363s2.848-6.363 6.357-6.363c1.644 0 3.125.62 4.267 1.636l3.228-3.228C19.56 2.502 16.15 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.91 0 12.18-4.85 12.18-12.24 0-.828-.08-1.428-.21-1.955H12.24z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    `;

    document.getElementById('checkout-login-btn')?.addEventListener('click', triggerLogin);
    summaryContainer.style.display = 'none';
    return;
  }

  // 2. If authenticated, render Checkout Form & Order Summary
  const user = getUserInfo();
  formContainer.innerHTML = `
    <div class="checkout-form-section">
      <h2 class="summary-title" style="margin-bottom: var(--spacing-12);">Shipping Details</h2>
      <div style="font-size: var(--text-body); color: var(--color-muted-gray); margin-bottom: var(--spacing-16);">
        Ordering as <strong>${user.fullName}</strong> (${user.email})
      </div>
      <form id="order-submit-form" onsubmit="event.preventDefault(); submitOrder();">
        <div class="form-row">
          <div class="form-group" style="margin-bottom: var(--spacing-16);">
            <label class="form-label">First Name</label>
            <input type="text" class="form-input" required placeholder="John">
          </div>
          <div class="form-group" style="margin-bottom: var(--spacing-16);">
            <label class="form-label">Last Name</label>
            <input type="text" class="form-input" required placeholder="Doe">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: var(--spacing-16);">
          <label class="form-label">Street Address</label>
          <input type="text" class="form-input" required placeholder="123 Creative Studio Rd">
        </div>
        <div class="form-row">
          <div class="form-group" style="margin-bottom: var(--spacing-16);">
            <label class="form-label">City</label>
            <input type="text" class="form-input" required placeholder="Bangalore">
          </div>
          <div class="form-group" style="margin-bottom: var(--spacing-16);">
            <label class="form-label">Postal Code</label>
            <input type="text" class="form-input" required placeholder="560001">
          </div>
        </div>
        
        <h2 class="summary-title" style="margin: var(--spacing-20) 0 var(--spacing-12) 0;">Payment Details</h2>
        <div class="form-group" style="margin-bottom: var(--spacing-24);">
          <label class="form-label">Card Information</label>
          <input type="text" class="form-input" required placeholder="4111 2222 3333 4444" pattern="[0-9 ]{13,19}">
        </div>

        <button type="submit" class="checkout-btn" style="width: 100%; background-color: var(--color-shop-violet);">
          Place Order
        </button>
      </form>
    </div>
  `;

  // Render Checkout Summary Column
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + shipping + tax;

  let itemsSummaryHTML = '';
  cart.forEach(item => {
    itemsSummaryHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-body-sm); color: var(--color-muted-gray);">
        <span>${item.name} (x${item.quantity})</span>
        <span>$${item.price * item.quantity}</span>
      </div>
    `;
  });

  summaryContainer.innerHTML = `
    <div class="cart-summary">
      <h2 class="summary-title">Order Items</h2>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-8); border-bottom: 1px solid var(--color-faint-border); padding-bottom: var(--spacing-16);">
        ${itemsSummaryHTML}
      </div>
      <div class="summary-rows">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? 'Free' : `$${shipping}`}</span>
        </div>
        <div class="summary-row">
          <span>Tax</span>
          <span>$${tax}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span>$${grandTotal}</span>
        </div>
      </div>
    </div>
  `;
}

// Handler for placing order
window.submitOrder = function() {
  const orderNum = "SH-" + Math.floor(100000 + Math.random() * 900000);
  const orderData = {
    orderNumber: orderNum,
    items: cart,
    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  };

  localStorage.setItem('shop_last_order', JSON.stringify(orderData));
  clearCart();
  window.location.href = 'success.html';
};

// ==========================================
// Order Success Page Logic (success.html)
// ==========================================
function renderSuccessPage() {
  const container = document.getElementById('success-summary-container');
  if (!container) return;

  const lastOrder = JSON.parse(localStorage.getItem('shop_last_order'));
  if (!lastOrder) {
    container.innerHTML = `
      <div class="success-container">
        <h2 class="success-title">Order not found</h2>
        <a href="index.html" class="shop-now-btn">Back to Home</a>
      </div>
    `;
    return;
  }

  let itemsListHTML = '';
  lastOrder.items.forEach(item => {
    itemsListHTML += `
      <div style="display: flex; justify-content: space-between; font-size: var(--text-body-sm); color: var(--color-muted-gray); padding: 4px 0;">
        <span>${item.name} × ${item.quantity}</span>
        <span>$${item.price * item.quantity}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="success-container">
      <div class="success-icon">
        <svg viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1 class="success-title">Thank you for your order!</h1>
      <p class="success-text">We've received your request and are preparing your package. A confirmation has been sent to your email.</p>
      
      <span class="order-number">Order: ${lastOrder.orderNumber}</span>

      <div style="width: 100%; border: 1px solid var(--color-faint-border); border-radius: var(--radius-inner-img); padding: var(--spacing-20); text-align: left; background-color: var(--color-canvas-mist); margin: var(--spacing-8) 0;">
        <h3 style="font-size: var(--text-body-lg); font-weight: 600; margin-bottom: var(--spacing-12);">Order Summary</h3>
        <div style="border-bottom: 1px solid var(--color-faint-border); padding-bottom: var(--spacing-12); margin-bottom: var(--spacing-12);">
          ${itemsListHTML}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: var(--text-body); font-weight: 700;">
          <span>Expected Delivery</span>
          <span>${lastOrder.deliveryDate}</span>
        </div>
      </div>

      <a href="index.html" class="add-to-cart-btn" style="text-decoration: none; width: auto;">
        Continue Shopping
      </a>
    </div>
  `;
}

// ==========================================
// Standalone Login Page Logic (login.html)
// ==========================================
function renderLoginPage() {
  // If already logged in, send home
  if (isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  const signinWrapper = document.getElementById('clerk-signin-container');
  if (!signinWrapper) return;

  if (!isDemoMode && clerkInstance) {
    // Mount Clerk Standalone SignIn UI
    clerkInstance.mountSignIn(signinWrapper, {
      afterSignInUrl: 'index.html',
      afterSignUpUrl: 'index.html'
    });
  } else {
    // Render Custom Google Demo Button
    signinWrapper.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%; gap: 16px; align-items: center;">
        <button class="clerk-login-btn" id="demo-page-signin-btn" style="width: 100%; justify-content: center; padding: var(--spacing-16) var(--spacing-32);">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.853-6.357-6.363s2.848-6.363 6.357-6.363c1.644 0 3.125.62 4.267 1.636l3.228-3.228C19.56 2.502 16.15 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.91 0 12.18-4.85 12.18-12.24 0-.828-.08-1.428-.21-1.955H12.24z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    `;

    document.getElementById('demo-page-signin-btn')?.addEventListener('click', triggerLogin);
  }
}
