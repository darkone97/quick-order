/**
 * The Velvet Hour Café - Application & WhatsApp Engine
 * Location: Badowala Dunga Road, Bhauwala, Dehradun
 * Primary WhatsApp: +91 7017690400
 */

(function () {
  'use strict';

  // State
  const state = {
    cart: JSON.parse(localStorage.getItem('velvet_hour_dehradun_cart')) || [],
    activeCategory: 'all',
    searchQuery: '',
    activeDiet: 'all',
    orderType: 'delivery', // 'delivery' | 'dine-in' | 'takeaway'
    deliveryZone: 'within_1km', // 'within_1km' (Free) | 'beyond_1km' (₹30)
    userLocation: {
      lat: null,
      lng: null,
      accuracy: null,
      mapsUrl: null
    },
    // Track selected portions or kg for each card in view
    cardSelections: {}
  };

  // DOM Elements
  const DOM = {
    navCartCount: document.getElementById('nav-cart-count'),
    openCartBtn: document.getElementById('open-cart-btn'),
    categoryPillsContainer: document.getElementById('category-pills-container'),
    menuSearchInput: document.getElementById('menu-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    filterDietAll: document.getElementById('filter-diet-all'),
    filterDietVeg: document.getElementById('filter-diet-veg'),
    filterDietNonVeg: document.getElementById('filter-diet-nonveg'),
    menuGrid: document.getElementById('menu-grid'),

    // Cart Drawer
    cartDrawerOverlay: document.getElementById('cart-drawer-overlay'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    drawerCartCount: document.getElementById('drawer-cart-count'),
    drawerItemsContainer: document.getElementById('drawer-items-container'),
    billSubtotal: document.getElementById('bill-subtotal'),
    billDelivery: document.getElementById('bill-delivery'),
    billGrandTotal: document.getElementById('bill-grand-total'),
    drawerCheckoutBtn: document.getElementById('drawer-checkout-btn'),

    // Checkout & GPS Modal
    checkoutModalBackdrop: document.getElementById('checkout-modal-backdrop'),
    closeCheckoutModalBtn: document.getElementById('close-checkout-modal-btn'),
    checkoutName: document.getElementById('checkout-name'),
    checkoutPhone: document.getElementById('checkout-phone'),
    orderTypeCards: document.querySelectorAll('.order-type-card'),
    deliveryZoneRadios: document.getElementsByName('delivery-zone'),
    deliveryZoneSection: document.getElementById('delivery-zone-section'),
    detectGpsBtn: document.getElementById('detect-gps-btn'),
    gpsStatusIndicator: document.getElementById('gps-status-indicator'),
    gpsLinkPreview: document.getElementById('gps-link-preview'),
    gpsCoordsDisplay: document.getElementById('gps-coords-display'),
    gpsMapsPreviewLink: document.getElementById('gps-maps-preview-link'),
    checkoutAddress: document.getElementById('checkout-address'),
    addressLabel: document.getElementById('address-label'),
    checkoutNotes: document.getElementById('checkout-notes'),
    checkoutTotalDisplay: document.getElementById('checkout-total-display'),
    sendWhatsappOrderBtn: document.getElementById('send-whatsapp-order-btn'),

    // Mobile Bar
    floatingMobileCart: document.getElementById('floating-mobile-cart'),
    mobileCartCount: document.getElementById('mobile-cart-count'),
    mobileCartTotal: document.getElementById('mobile-cart-total'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    renderCategoryPills();
    renderMenu();
    updateCartUI();
    bindEvents();
  }

  // ==========================================
  // RENDER CATEGORIES
  // ==========================================
  function renderCategoryPills() {
    if (!DOM.categoryPillsContainer) return;

    DOM.categoryPillsContainer.innerHTML = MENU_DATA.categories.map(cat => `
      <button class="cat-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    DOM.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        renderCategoryPills();
        renderMenu();
      });
    });
  }

  // ==========================================
  // RENDER MENU ITEMS
  // ==========================================
  function renderMenu() {
    if (!DOM.menuGrid) return;

    let filtered = MENU_DATA.items;

    // Category filter
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === state.activeCategory);
    }

    // Dietary filter
    if (state.activeDiet === 'veg') {
      filtered = filtered.filter(item => item.isVeg);
    } else if (state.activeDiet === 'nonveg') {
      filtered = filtered.filter(item => !item.isVeg);
    }

    // Search query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      DOM.menuGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🥟</div>
          <h3 class="serif-font" style="margin-bottom: 8px;">No Dishes Found</h3>
          <p style="color: var(--text-muted);">Try searching for Momo, Chowmein, Maggie, or Chai.</p>
        </div>
      `;
      return;
    }

    DOM.menuGrid.innerHTML = filtered.map(item => {
      // Default selection if not present
      if (!state.cardSelections[item.id]) {
        state.cardSelections[item.id] = {
          portion: item.type === 'portioned' ? 'half' : null,
          kg: item.type === 'bulk_kg' ? 1 : null
        };
      }

      const sel = state.cardSelections[item.id];
      let displayPrice = 0;

      if (item.type === 'portioned') {
        displayPrice = sel.portion === 'full' ? item.fullPrice : item.halfPrice;
      } else if (item.type === 'bulk_kg') {
        displayPrice = Math.round(item.pricePerKg * (sel.kg || 1));
      } else {
        displayPrice = item.price;
      }

      return `
        <div class="menu-card" data-id="${item.id}">
          <div class="card-img-wrap">
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='velvet_hour_logo.jpg';">
            ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
            <span class="diet-indicator ${item.isVeg ? 'veg' : 'nonveg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          </div>

          <div class="card-body">
            <div class="card-title-row">
              <h3 class="card-title">${item.name}</h3>
            </div>
            
            ${item.notes ? `<div class="card-note">✨ ${item.notes}</div>` : ''}
            <p class="card-desc">${item.description}</p>

            <!-- Portioned Selector (Half vs Full) -->
            ${item.type === 'portioned' ? `
              <div class="portion-switch-row">
                <button class="portion-btn ${sel.portion === 'half' ? 'active' : ''}" 
                        onclick="window.VelvetApp.setPortion('${item.id}', 'half')">
                  <span>Half Portion</span>
                  <span class="portion-price">₹${item.halfPrice}</span>
                </button>
                <button class="portion-btn ${sel.portion === 'full' ? 'active' : ''}" 
                        onclick="window.VelvetApp.setPortion('${item.id}', 'full')">
                  <span>Full Portion</span>
                  <span class="portion-price">₹${item.fullPrice}</span>
                </button>
              </div>
            ` : ''}

            <!-- Bulk Kg Stepper (For Chicken / Mutton per Kg) -->
            ${item.type === 'bulk_kg' ? `
              <div class="bulk-kg-row">
                <span class="bulk-kg-label">Quantity (in Kg):</span>
                <div class="bulk-kg-stepper">
                  <button class="kg-btn" onclick="window.VelvetApp.adjustKg('${item.id}', -0.5)">−</button>
                  <span class="kg-display-val">${sel.kg} kg</span>
                  <button class="kg-btn" onclick="window.VelvetApp.adjustKg('${item.id}', 0.5)">+</button>
                </div>
              </div>
            ` : ''}

            <div class="card-footer">
              <div class="price-tag">
                <span class="price-label">${item.type === 'bulk_kg' ? `Price (${sel.kg} kg)` : (item.type === 'portioned' ? (sel.portion === 'full' ? 'Full Price' : 'Half Price') : 'Price')}</span>
                <span class="price-amount" id="price-display-${item.id}">₹${displayPrice}</span>
              </div>
              <button class="add-btn" onclick="window.VelvetApp.addItemToCart('${item.id}')">
                <span>Add +</span>
              </button>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // CARD INTERACTION HELPERS
  // ==========================================
  function setPortion(itemId, portion) {
    if (!state.cardSelections[itemId]) state.cardSelections[itemId] = {};
    state.cardSelections[itemId].portion = portion;
    renderMenu();
  }

  function adjustKg(itemId, delta) {
    if (!state.cardSelections[itemId]) state.cardSelections[itemId] = { kg: 1 };
    let current = state.cardSelections[itemId].kg || 1;
    current = Math.max(1, current + delta);
    state.cardSelections[itemId].kg = current;
    renderMenu();
  }

  // ==========================================
  // CART OPERATIONS
  // ==========================================
  function addItemToCart(itemId) {
    const item = MENU_DATA.items.find(i => i.id === itemId);
    if (!item) return;

    const sel = state.cardSelections[itemId] || {};
    let cartItemName = item.name;
    let unitPrice = item.price;
    let portionDetail = '';

    if (item.type === 'portioned') {
      const isFull = sel.portion === 'full';
      unitPrice = isFull ? item.fullPrice : item.halfPrice;
      portionDetail = isFull ? 'Full Portion' : 'Half Portion';
    } else if (item.type === 'bulk_kg') {
      const kg = sel.kg || 1;
      unitPrice = Math.round(item.pricePerKg * kg);
      portionDetail = `${kg} Kg (₹${item.pricePerKg}/kg)`;
    } else {
      portionDetail = 'Standard';
      unitPrice = item.price;
    }

    const cartKey = `${item.id}-${portionDetail}`;
    const existingIndex = state.cart.findIndex(i => i.cartKey === cartKey);

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({
        cartKey: cartKey,
        id: item.id,
        name: cartItemName,
        portionDetail: portionDetail,
        unitPrice: unitPrice,
        quantity: 1,
        image: item.image,
        type: item.type,
        isVeg: item.isVeg
      });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${cartItemName} (${portionDetail}) to order!`, 'success', '🥟');
  }

  function updateQty(cartKey, delta) {
    const idx = state.cart.findIndex(i => i.cartKey === cartKey);
    if (idx === -1) return;

    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) {
      state.cart.splice(idx, 1);
    }

    saveCart();
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('velvet_hour_dehradun_cart', JSON.stringify(state.cart));
  }

  function calculateBill() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    let delivery = 0;

    if (state.orderType === 'delivery') {
      delivery = state.deliveryZone === 'within_1km' ? 0 : MENU_DATA.cafeInfo.deliveryFeeBeyond;
    }

    const grandTotal = subtotal + delivery;

    return { subtotal, delivery, grandTotal };
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const bill = calculateBill();

    if (DOM.navCartCount) DOM.navCartCount.textContent = totalCount;
    if (DOM.drawerCartCount) DOM.drawerCartCount.textContent = totalCount;

    if (DOM.floatingMobileCart) {
      if (totalCount > 0) {
        DOM.floatingMobileCart.classList.add('visible');
        DOM.mobileCartCount.textContent = totalCount;
        DOM.mobileCartTotal.textContent = `₹${bill.grandTotal}`;
      } else {
        DOM.floatingMobileCart.classList.remove('visible');
      }
    }

    if (!DOM.drawerItemsContainer) return;

    if (state.cart.length === 0) {
      DOM.drawerItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🥟</div>
          <h3 class="serif-font" style="margin-bottom: 8px;">Your Order is Empty</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            Explore our delicious momos, chowmein, chaat and special bulk items to add to your order.
          </p>
        </div>
      `;
      DOM.drawerCheckoutBtn.disabled = true;
      DOM.drawerCheckoutBtn.style.opacity = '0.5';
    } else {
      DOM.drawerCheckoutBtn.disabled = false;
      DOM.drawerCheckoutBtn.style.opacity = '1';

      DOM.drawerItemsContainer.innerHTML = `
        <div class="cart-items-list">
          ${state.cart.map(item => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img">
              <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-portion">${item.portionDetail}</div>
                <div class="cart-item-price">₹${item.unitPrice * item.quantity}</div>
              </div>
              <div class="cart-item-controls">
                <button class="qty-btn" onclick="window.VelvetApp.updateQty('${item.cartKey}', -1)">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="window.VelvetApp.updateQty('${item.cartKey}', 1)">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    DOM.billSubtotal.textContent = `₹${bill.subtotal}`;
    DOM.billDelivery.textContent = bill.delivery === 0 ? 'FREE (Within 1km)' : `₹${bill.delivery}`;
    DOM.billGrandTotal.textContent = `₹${bill.grandTotal}`;
    DOM.checkoutTotalDisplay.textContent = `₹${bill.grandTotal}`;
  }

  // ==========================================
  // DRAWER & CHECKOUT
  // ==========================================
  function openCartDrawer() {
    DOM.cartDrawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    DOM.cartDrawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Please add items to your cart first!', 'error', '⚠️');
      return;
    }
    closeCartDrawer();
    DOM.checkoutModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    DOM.checkoutModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setOrderType(type) {
    state.orderType = type;
    DOM.orderTypeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.type === type);
    });

    if (DOM.deliveryZoneSection) {
      DOM.deliveryZoneSection.style.display = type === 'delivery' ? 'block' : 'none';
    }

    if (type === 'dine-in') {
      DOM.addressLabel.textContent = 'Café Table Number / Seating Note';
      DOM.checkoutAddress.placeholder = 'e.g. Table #3 inside cafe';
    } else if (type === 'takeaway') {
      DOM.addressLabel.textContent = 'Self Pickup Vehicle No. / Note (Optional)';
      DOM.checkoutAddress.placeholder = 'e.g. White Activa UK-07-XX, picking up in 10 mins';
    } else {
      DOM.addressLabel.textContent = 'House / Flat / Hostel No., Building & Nearby Landmark';
      DOM.checkoutAddress.placeholder = 'e.g. Room 204, Green Valley Hostel, Badowala Dunga Road';
    }

    updateCartUI();
  }

  // ==========================================
  // GPS GEOLOCATION DETECTOR
  // ==========================================
  function detectLiveGPSLocation() {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported on this browser.', 'error', '⚠️');
      DOM.gpsStatusIndicator.innerHTML = '<span style="color: #ef4444;">❌ Geolocation unsupported</span>';
      return;
    }

    DOM.gpsStatusIndicator.className = 'location-status loading';
    DOM.gpsStatusIndicator.innerHTML = '<span>🛰️ Pinpointing live GPS coordinates...</span>';
    DOM.detectGpsBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const accuracy = Math.round(position.coords.accuracy);
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        state.userLocation = { lat, lng, accuracy, mapsUrl };

        DOM.gpsStatusIndicator.className = 'location-status success';
        DOM.gpsStatusIndicator.innerHTML = `<span>✅ Live Location Attached (±${accuracy}m accuracy)</span>`;
        
        DOM.gpsLinkPreview.style.display = 'flex';
        DOM.gpsCoordsDisplay.textContent = `GPS: ${lat}, ${lng}`;
        DOM.gpsMapsPreviewLink.href = mapsUrl;
        DOM.detectGpsBtn.disabled = false;

        showToast('Live GPS location successfully attached!', 'success', '📍');
      },
      (error) => {
        DOM.detectGpsBtn.disabled = false;
        DOM.gpsStatusIndicator.className = 'location-status error';
        DOM.gpsStatusIndicator.innerHTML = '<span>⚠️ GPS unavailable. Please type address below.</span>';
        showToast('Location permission unavailable. Please type your address.', 'info', 'ℹ️');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  // ==========================================
  // WHATSAPP ORDER DISPATCHER
  // Number: 917017690400
  // ==========================================
  function sendOrderViaWhatsApp() {
    const customerName = DOM.checkoutName.value.trim();
    const customerPhone = DOM.checkoutPhone.value.trim();
    const addressDetails = DOM.checkoutAddress.value.trim();
    const notes = DOM.checkoutNotes.value.trim();

    if (!customerName) {
      showToast('Please enter your name.', 'error', '⚠️');
      DOM.checkoutName.focus();
      return;
    }

    if (!customerPhone || customerPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error', '⚠️');
      DOM.checkoutPhone.focus();
      return;
    }

    if (state.orderType === 'delivery' && !addressDetails && !state.userLocation.mapsUrl) {
      showToast('Please provide your delivery address or click Pinpoint Location.', 'error', '📍');
      DOM.checkoutAddress.focus();
      return;
    }

    const bill = calculateBill();
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    const typeLabels = {
      'delivery': '🛵 Doorstep Delivery',
      'dine-in': '🍽️ Dine-In (Café Table)',
      'takeaway': '🛍️ Self Takeaway'
    };

    let msg = `🥟 *NEW ORDER - THE VELVET HOUR CAFÉ* 🥟\n`;
    msg += `📍 _Badowala Dunga Road, Bhauwala, Dehradun_\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Customer Name:* ${customerName}\n`;
    msg += `📱 *Phone Number:* ${customerPhone}\n`;
    msg += `🛎️ *Order Mode:* ${typeLabels[state.orderType]}\n\n`;

    msg += `📋 *ORDER ITEMS:*\n`;
    state.cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.quantity}x ${item.name}* (${item.portionDetail}) — ₹${item.unitPrice * item.quantity}\n`;
    });

    msg += `\n💵 *BILL SUMMARY:*\n`;
    msg += `• Items Total: ₹${bill.subtotal}\n`;
    if (state.orderType === 'delivery') {
      msg += `• Delivery Fee: ${bill.delivery === 0 ? 'FREE (Within 1 km)' : '₹' + bill.delivery + ' (Beyond 1 km)'}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *TOTAL PAYABLE:* ₹${bill.grandTotal}\n\n`;

    if (state.orderType === 'delivery') {
      msg += `📍 *CUSTOMER DELIVERY LOCATION:*\n`;
      if (state.userLocation.mapsUrl) {
        msg += `🗺️ *Live GPS Google Maps Pin:*\n${state.userLocation.mapsUrl}\n`;
      }
      if (addressDetails) {
        msg += `🏠 *Address / Landmark:* ${addressDetails}\n`;
      }
    } else if (state.orderType === 'dine-in') {
      msg += `🍽️ *Café Table:* ${addressDetails || 'Direct Table Seating'}\n`;
    } else {
      msg += `🛍️ *Pickup Note:* ${addressDetails || 'Self Pickup'}\n`;
    }

    if (notes) {
      msg += `\n📝 *Kitchen Instructions:* ${notes}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🕒 *Order Time:* ${timeString}\n`;
    msg += `_The Velvet Hour Café • Call / WhatsApp: +91 7017690400_`;

    const targetNumber = '917017690400';
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');
    showToast('Redirecting to WhatsApp to send your order...', 'success', '💬');
    closeCheckoutModal();
  }

  // Toast
  function showToast(message, type = 'info', icon = '✨') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // Event bindings
  function bindEvents() {
    if (DOM.openCartBtn) DOM.openCartBtn.addEventListener('click', openCartDrawer);
    if (DOM.closeCartBtn) DOM.closeCartBtn.addEventListener('click', closeCartDrawer);
    if (DOM.floatingMobileCart) DOM.floatingMobileCart.addEventListener('click', openCartDrawer);
    if (DOM.cartDrawerOverlay) {
      DOM.cartDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.cartDrawerOverlay) closeCartDrawer();
      });
    }

    if (DOM.menuSearchInput) {
      DOM.menuSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
        renderMenu();
      });
    }

    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.menuSearchInput.value = '';
        state.searchQuery = '';
        DOM.clearSearchBtn.style.display = 'none';
        renderMenu();
      });
    }

    [DOM.filterDietAll, DOM.filterDietVeg, DOM.filterDietNonVeg].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          [DOM.filterDietAll, DOM.filterDietVeg, DOM.filterDietNonVeg].forEach(b => b && b.classList.remove('active'));
          btn.classList.add('active');
          state.activeDiet = btn.dataset.diet;
          renderMenu();
        });
      }
    });

    if (DOM.drawerCheckoutBtn) DOM.drawerCheckoutBtn.addEventListener('click', openCheckoutModal);
    if (DOM.closeCheckoutModalBtn) DOM.closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
    if (DOM.checkoutModalBackdrop) {
      DOM.checkoutModalBackdrop.addEventListener('click', (e) => {
        if (e.target === DOM.checkoutModalBackdrop) closeCheckoutModal();
      });
    }

    DOM.orderTypeCards.forEach(card => {
      card.addEventListener('click', () => setOrderType(card.dataset.type));
    });

    if (DOM.deliveryZoneRadios) {
      DOM.deliveryZoneRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          state.deliveryZone = e.target.value;
          updateCartUI();
        });
      });
    }

    if (DOM.detectGpsBtn) DOM.detectGpsBtn.addEventListener('click', detectLiveGPSLocation);
    if (DOM.sendWhatsappOrderBtn) DOM.sendWhatsappOrderBtn.addEventListener('click', sendOrderViaWhatsApp);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCheckoutModal();
        closeCartDrawer();
      }
    });
  }

  // Global interface
  window.VelvetApp = {
    setPortion: setPortion,
    adjustKg: adjustKg,
    addItemToCart: addItemToCart,
    updateQty: updateQty
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
