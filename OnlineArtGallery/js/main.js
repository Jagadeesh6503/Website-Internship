// ── GLOBAL CONFIG ──
window.API_BASE = 'http://localhost:8080/api';
const API = window.API_BASE;

// ── API HELPER ──
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('artToken');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API}${endpoint}`, { ...options, headers });
    if (res.status === 401) { handleUnauthorized(); return null; }
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    console.warn('API unavailable, using mock data');
    return null;
  }
}

// ── AUTH STATE ──
function getUser() { try { return JSON.parse(localStorage.getItem('artUser') || 'null'); } catch { return null; } }
function isLoggedIn() { return !!localStorage.getItem('artToken') && !!getUser(); }
function logout() {
  localStorage.removeItem('artToken'); localStorage.removeItem('artUser');
  showToast('Logged out successfully', 'info');
  setTimeout(() => location.href = 'index.html', 800);
}
function handleUnauthorized() { logout(); }

// ── UPDATE NAV AUTH UI ──
function updateNavAuth() {
  const user = getUser();
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const userAvatar = document.getElementById('userAvatar');
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userAvatar) {
      userAvatar.style.display = 'block';
      userAvatar.src = user.avatar || `https://picsum.photos/seed/${user.id||'u'}/40/40`;
      userAvatar.title = user.firstName + ' ' + user.lastName;
    }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = '';
    if (userAvatar) userAvatar.style.display = 'none';
  }
}

// ── CART ──
function getCart() { try { return JSON.parse(localStorage.getItem('artGalleryCart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('artGalleryCart', JSON.stringify(cart)); updateBadges(); }
function addToCart(artwork) {
  const cart = getCart();
  const existing = cart.find(i => i.id === artwork.id);
  if (existing) { existing.qty = (existing.qty || 1) + 1; } else { cart.push({ ...artwork, qty: 1 }); }
  saveCart(cart);
  showToast(`"${artwork.title}" added to cart!`, 'success');
}
function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

// ── WISHLIST ──
function getWishlist() { try { return JSON.parse(localStorage.getItem('artGalleryWishlist') || '[]'); } catch { return []; } }
function saveWishlist(list) { localStorage.setItem('artGalleryWishlist', JSON.stringify(list)); updateBadges(); }
function toggleWishlist(artwork, btn) {
  let wish = getWishlist();
  const idx = wish.findIndex(i => i.id === artwork.id);
  if (idx >= 0) {
    wish.splice(idx, 1);
    if (btn) btn.classList.remove('active');
    showToast('Removed from wishlist', 'info');
  } else {
    wish.push(artwork);
    if (btn) btn.classList.add('active');
    showToast(`"${artwork.title}" saved to wishlist!`, 'success');
  }
  saveWishlist(wish);
}
function isWishlisted(id) { return getWishlist().some(i => i.id === id); }

// ── BADGES ──
function updateBadges() {
  const cartCount = getCart().reduce((s, i) => s + (i.qty || 1), 0);
  const wishCount = getWishlist().length;
  document.querySelectorAll('#cartBadge').forEach(b => b.textContent = cartCount);
  document.querySelectorAll('#wishBadge').forEach(b => b.textContent = wishCount);
}

// ── TOAST ──
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'none'; toast.style.opacity = '0'; toast.style.transform = 'translateX(110%)'; toast.style.transition = '.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── MODAL ──
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id); });

// ── NAVBAR SCROLL ──
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', () => nav.classList.toggle('navbar__mobile-open'));
}

// ── AOS (simple intersection observer) ──
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); obs.unobserve(e.target); } }), { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── TAB SYSTEM ──
function showTab(tabId, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById('tab-' + tabId);
  if (pane) pane.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── SEARCH ──
function doSearch() {
  const q = document.getElementById('heroSearch')?.value?.trim();
  if (q) location.href = `gallery.html?q=${encodeURIComponent(q)}`;
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement?.id === 'heroSearch') doSearch();
});

// ── MOCK DATA ──
window.MOCK_ARTWORKS = [
  {id:1,title:'Sunset Reverie',artist:'Priya Sharma',category:'Painting',medium:'Oil on Canvas',price:'₹45,000',priceNum:45000,img:'https://picsum.photos/seed/art10/400/500',badge:'Featured',rating:4.9,views:1234,style:'Impressionism'},
  {id:2,title:'Digital Cosmos',artist:'Arjun Mehta',category:'Digital Art',medium:'Digital',price:'₹22,500',priceNum:22500,img:'https://picsum.photos/seed/art11/400/600',badge:'New',rating:4.7,views:892,style:'Abstract'},
  {id:3,title:'Urban Soul',artist:'Kavya Nair',category:'Photography',medium:'Digital Photography',price:'₹18,000',priceNum:18000,img:'https://picsum.photos/seed/art12/400/450',badge:'',rating:4.8,views:645,style:'Contemporary'},
  {id:4,title:'Ancient Whispers',artist:'Rohan Das',category:'Sculpture',medium:'Bronze',price:'₹1,20,000',priceNum:120000,img:'https://picsum.photos/seed/art13/400/520',badge:'Exclusive',rating:5.0,views:2341,style:'Realism'},
  {id:5,title:'Monsoon Dreams',artist:'Meena Pillai',category:'Watercolor',medium:'Watercolor',price:'₹12,000',priceNum:12000,img:'https://picsum.photos/seed/art14/400/480',badge:'',rating:4.6,views:421,style:'Impressionism'},
  {id:6,title:'Abstract Pulse',artist:'Sanjay Kumar',category:'Abstract',medium:'Acrylic',price:'₹35,000',priceNum:35000,img:'https://picsum.photos/seed/art15/400/560',badge:'Hot',rating:4.8,views:1567,style:'Abstract'},
  {id:7,title:'Temple Echoes',artist:'Divya Rao',category:'Painting',medium:'Oil on Canvas',price:'₹68,000',priceNum:68000,img:'https://picsum.photos/seed/art16/400/510',badge:'',rating:4.7,views:789,style:'Realism'},
  {id:8,title:'Neon Jungle',artist:'Kiran Shah',category:'Digital Art',medium:'Digital',price:'₹15,000',priceNum:15000,img:'https://picsum.photos/seed/art17/400/490',badge:'New',rating:4.5,views:334,style:'Contemporary'},
  {id:9,title:'Coastal Serenity',artist:'Anita Joshi',category:'Painting',medium:'Acrylic',price:'₹28,000',priceNum:28000,img:'https://picsum.photos/seed/art18/400/540',badge:'',rating:4.9,views:956,style:'Impressionism'},
  {id:10,title:'Fractured Light',artist:'Vijay Menon',category:'Abstract',medium:'Mixed Media',price:'₹52,000',priceNum:52000,img:'https://picsum.photos/seed/art19/400/470',badge:'Featured',rating:4.8,views:1123,style:'Abstract'},
  {id:11,title:'Village Morning',artist:'Sunita Rao',category:'Painting',medium:'Oil on Canvas',price:'₹39,000',priceNum:39000,img:'https://picsum.photos/seed/art20/400/520',badge:'',rating:4.6,views:567,style:'Realism'},
  {id:12,title:'Cyber Dreams',artist:'Ravi Kumar',category:'Digital Art',medium:'Digital',price:'₹17,500',priceNum:17500,img:'https://picsum.photos/seed/art21/400/490',badge:'Hot',rating:4.7,views:834,style:'Contemporary'},
];

window.MOCK_ARTISTS = [
  {id:1,name:'Priya Sharma',style:'Impressionism',works:24,followers:1234,img:'https://picsum.photos/seed/a1/200/200'},
  {id:2,name:'Arjun Mehta',style:'Digital Art',works:18,followers:892,img:'https://picsum.photos/seed/a2/200/200'},
  {id:3,name:'Kavya Nair',style:'Photography',works:31,followers:2341,img:'https://picsum.photos/seed/a3/200/200'},
  {id:4,name:'Rohan Das',style:'Sculpture',works:12,followers:567,img:'https://picsum.photos/seed/a4/200/200'},
  {id:5,name:'Meena Pillai',style:'Watercolor',works:27,followers:1456,img:'https://picsum.photos/seed/a5/200/200'},
  {id:6,name:'Sanjay Kumar',style:'Abstract',works:19,followers:789,img:'https://picsum.photos/seed/a6/200/200'},
  {id:7,name:'Divya Rao',style:'Realism',works:22,followers:1123,img:'https://picsum.photos/seed/a7/200/200'},
  {id:8,name:'Kiran Shah',style:'Contemporary',works:15,followers:456,img:'https://picsum.photos/seed/a8/200/200'},
];

// ── ARTWORK CARD HTML ──
function artworkCardHTML(a) {
  const wishlisted = isWishlisted(a.id);
  return `
    <div class="artwork-card" id="art-${a.id}">
      <div class="artwork-card__img-wrap">
        <img class="artwork-card__img" src="${a.img}" alt="${a.title}" loading="lazy"/>
        <div class="artwork-card__overlay">
          <div class="artwork-card__actions">
            <button class="btn btn-primary btn-sm" onclick='addToCart(${JSON.stringify({id:a.id,title:a.title,artist:a.artist,price:a.price,img:a.img})})'>🛒 Add to Cart</button>
            <a href="artwork-detail.html?id=${a.id}" class="btn btn-ghost btn-sm">View</a>
          </div>
        </div>
        ${a.badge ? `<div class="artwork-card__badge">${a.badge}</div>` : ''}
        <button class="artwork-card__wish ${wishlisted ? 'active' : ''}" onclick='toggleWishlist({id:${a.id},title:"${a.title}",artist:"${a.artist}",price:"${a.price}",img:"${a.img}"},this)'>♥</button>
      </div>
      <div class="artwork-card__info">
        <div class="artwork-card__title">${a.title}</div>
        <div class="artwork-card__artist">${a.artist} · ${a.category}</div>
      </div>
      <div class="artwork-card__footer">
        <span class="artwork-card__price">${a.price}</span>
        <span style="font-size:.75rem;color:var(--text-muted);">⭐ ${a.rating} · 👁 ${a.views}</span>
      </div>
    </div>`;
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateNavAuth();
  updateBadges();
  initAOS();
});
