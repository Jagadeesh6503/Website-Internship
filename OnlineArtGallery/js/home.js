// ── PARTICLES ──
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1,
    alpha: Math.random() * 0.4 + 0.1
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000, step = 16;
  const inc = target / (duration / step);
  const timer = setInterval(() => {
    start += inc;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString('en-IN') + suffix;
  }, step);
}

function initCounters() {
  const counters = [
    { id: 'statArtworks', val: 1200, suffix: '+' },
    { id: 'statArtists', val: 350, suffix: '+' },
    { id: 'statExhibitions', val: 80, suffix: '+' },
    { id: 'statSales', val: 5400, suffix: '+' },
  ];
  const el = document.getElementById('statArtworks');
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      counters.forEach(c => { const e = document.getElementById(c.id); if (e) animateCounter(e, c.val, c.suffix); });
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(el);
}

// ── AUCTION TICKER ──
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = [
    { title: 'Sunset Reverie', artist: 'Priya Sharma', price: '₹52,000', time: '12:34', img: 'https://picsum.photos/seed/t1/36/36' },
    { title: 'Digital Cosmos', artist: 'Arjun Mehta', price: '₹28,500', time: '08:20', img: 'https://picsum.photos/seed/t2/36/36' },
    { title: 'Ancient Whispers', artist: 'Rohan Das', price: '₹1,45,000', time: '02:05', img: 'https://picsum.photos/seed/t3/36/36' },
    { title: 'Fractured Light', artist: 'Vijay Menon', price: '₹67,000', time: '45:00', img: 'https://picsum.photos/seed/t4/36/36' },
    { title: 'Neon Jungle', artist: 'Kiran Shah', price: '₹19,000', time: '22:15', img: 'https://picsum.photos/seed/t5/36/36' },
  ];
  const html = items.map(i => `
    <div class="ticker__item">
      <img src="${i.img}" alt="${i.title}"/>
      <span class="ticker__item-title">${i.title} by ${i.artist}</span>
      <span class="ticker__item-price">${i.price}</span>
      <span class="ticker__item-time">⏱ ${i.time} left</span>
    </div>`).join('');
  track.innerHTML = html + html; // duplicate for seamless loop
}

// ── CATEGORIES ──
function initCategories() {
  const strip = document.getElementById('categoriesStrip');
  if (!strip) return;
  const cats = ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Watercolor', 'Abstract', 'Prints'];
  cats.forEach(c => {
    const pill = document.createElement('div');
    pill.className = 'cat-pill';
    pill.textContent = c;
    pill.onclick = () => filterByCategory(pill, c);
    strip.appendChild(pill);
  });
}

window.filterByCategory = function (el, cat) {
  document.querySelectorAll('#categoriesStrip .cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const artworks = cat === 'all' ? window.MOCK_ARTWORKS : window.MOCK_ARTWORKS.filter(a => a.category === cat);
  renderFeatured(artworks.slice(0, 8));
};

// ── FEATURED ARTWORKS ──
function renderFeatured(artworks) {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  if (!artworks.length) { grid.innerHTML = '<div class="no-results"><h3>No artworks found</h3></div>'; return; }
  grid.innerHTML = artworks.map(a => artworkCardHTML(a)).join('');
}

async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const res = await apiCall('/artworks/featured?limit=8');
  const artworks = res?.ok ? res.data : window.MOCK_ARTWORKS.slice(0, 8);
  renderFeatured(artworks);
}

// ── ARTISTS ──
async function loadArtists() {
  const row = document.getElementById('artistsRow');
  if (!row) return;
  const res = await apiCall('/artists?limit=8');
  const artists = res?.ok ? res.data : window.MOCK_ARTISTS;
  row.innerHTML = artists.map(a => `
    <div class="artist-card" onclick="location.href='artist-profile.html?id=${a.id}'">
      <img class="artist-card__avatar" src="${a.img}" alt="${a.name}" loading="lazy"/>
      <div class="artist-card__name">${a.name}</div>
      <div class="artist-card__style">${a.style}</div>
      <div class="artist-card__works">${a.works} Artworks · ${(a.followers||0).toLocaleString()} Followers</div>
    </div>`).join('');
}

// ── NEWSLETTER ──
window.subscribeNewsletter = async function () {
  const email = document.getElementById('nlEmail')?.value?.trim();
  const name = document.getElementById('nlName')?.value?.trim();
  if (!email || !name) { showToast('Please fill in all fields', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { showToast('Please enter a valid email', 'error'); return; }
  const res = await apiCall('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email, name }) });
  showToast('🎉 Subscribed! Check your email for a welcome gift.', 'success');
  document.getElementById('nlEmail').value = '';
  document.getElementById('nlName').value = '';
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCounters();
  initTicker();
  initCategories();
  loadFeatured();
  loadArtists();
});
