// ── CART PAGE JS ──
function fmtPrice(n) { return '₹' + n.toLocaleString('en-IN'); }

function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cartItemsList');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty"><div style="font-size:4rem;margin-bottom:1rem;">🛒</div><h3>Your cart is empty</h3><p>Browse our gallery and add artworks you love!</p><a href="gallery.html" class="btn btn-primary btn-lg" style="margin-top:1.5rem;">Browse Gallery</a></div>`;
    updateSummary(0, 0);
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <img class="cart-item__img" src="${item.img}" alt="${item.title}"/>
      <div>
        <div class="cart-item__title">${item.title}</div>
        <div class="cart-item__artist">${item.artist}</div>
        <div class="cart-item__actions">
          <div class="qty-stepper">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty || 1}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="cart-item__remove" onclick="deleteCartItem(${item.id})">🗑️ Remove</button>
          <button class="cart-item__remove" onclick="moveToWishlist(${item.id})">♡ Save</button>
        </div>
      </div>
      <div class="cart-item__price"><div class="current">${item.price}</div></div>
    </div>`).join('');

  const subtotal = cart.reduce((sum, i) => sum + ((i.priceNum || parsePrice(i.price)) * (i.qty || 1)), 0);
  updateSummary(subtotal, 0);
}

function parsePrice(str) { return parseInt(String(str).replace(/[^\d]/g, '')) || 0; }

function updateSummary(subtotal, discount) {
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax - discount;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmtPrice(val); };
  set('summarySubtotal', subtotal);
  set('summaryTax', tax);
  set('summaryTotal', total);
  if (discount) { set('summaryDiscount', discount); const dr = document.getElementById('discountRow'); if (dr) dr.style.display = 'flex'; }
}

window.changeQty = function (id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, (item.qty || 1) + delta);
  saveCart(cart);
  renderCart();
};

window.deleteCartItem = function (id) {
  removeFromCart(id);
  showToast('Item removed from cart', 'info');
  renderCart();
};

window.moveToWishlist = function (id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { toggleWishlist(item, null); deleteCartItem(id); }
};

window.applyCoupon = function () {
  const code = document.getElementById('couponInput')?.value.trim().toUpperCase();
  const coupons = { 'ART10': 0.10, 'ART20': 0.20, 'FIRST15': 0.15 };
  if (coupons[code]) {
    const cart = getCart();
    const subtotal = cart.reduce((sum, i) => sum + ((i.priceNum || parsePrice(i.price)) * (i.qty || 1)), 0);
    const disc = Math.round(subtotal * coupons[code]);
    updateSummary(subtotal, disc);
    showToast(`Coupon applied! ${code} — ${(coupons[code]*100)}% off`, 'success');
  } else {
    showToast('Invalid coupon code', 'error');
  }
};

document.addEventListener('DOMContentLoaded', renderCart);
