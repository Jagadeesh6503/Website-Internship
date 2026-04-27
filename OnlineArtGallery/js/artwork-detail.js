// ── ARTWORK DETAIL JS ──
let artworkData = null;
let selectedRating = 0;

async function loadArtworkDetail() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id')) || 1;
  const res = await apiCall(`/artworks/${id}`);
  artworkData = res?.ok ? res.data : (window.MOCK_ARTWORKS.find(a=>a.id===id) || window.MOCK_ARTWORKS[0]);
  renderDetail(artworkData);
  loadRelated(artworkData.category);
  renderReviews();
}

function renderDetail(a) {
  document.title = `${a.title} — ArtVault`;
  document.getElementById('artBreadcrumb').textContent = a.title;
  const layout = document.getElementById('artworkDetail');
  if (!layout) return;
  const wishlisted = isWishlisted(a.id);
  layout.innerHTML = `
    <div class="artwork-viewer">
      <div class="artwork-main-img" onclick="openZoom()">
        <img src="${a.img}" alt="${a.title}" id="mainArtImg"/>
        <div class="artwork-zoom-hint">🔍 Click to zoom</div>
      </div>
      <div class="artwork-thumbs">
        <div class="artwork-thumb active"><img src="${a.img}" alt="Main"/></div>
        <div class="artwork-thumb"><img src="https://picsum.photos/seed/${a.id}b/80/60" alt="View 2"/></div>
        <div class="artwork-thumb"><img src="https://picsum.photos/seed/${a.id}c/80/60" alt="View 3"/></div>
      </div>
    </div>
    <div class="artwork-info">
      <div class="artwork-badges">
        <span class="badge badge-gold">${a.category}</span>
        ${a.badge?`<span class="badge badge-purple">${a.badge}</span>`:''}
        <span class="badge badge-green">✅ Available</span>
      </div>
      <h1 class="artwork-title">${a.title}</h1>
      <div class="artwork-artist-row">
        <img src="https://picsum.photos/seed/artist${a.id}/44/44" alt="${a.artist}" class="artwork-artist-avatar"/>
        <div class="artwork-artist-info">
          <a href="artist-profile.html?id=${a.id}">${a.artist}</a>
          <small>${a.style||'Contemporary'} Artist</small>
        </div>
        <button class="btn btn-outline btn-sm" style="margin-left:auto;" onclick="followArtist()">+ Follow</button>
      </div>
      <div class="artwork-price-row">
        <div class="artwork-price">${a.price}</div>
        <div class="stars">★★★★★ <span style="color:var(--text-muted);font-size:.85rem;margin-left:.25rem;">${a.rating} (${a.views} views)</span></div>
      </div>
      <div class="artwork-meta-grid">
        <div class="artwork-meta-item"><label>Medium</label><span>${a.medium||'Oil on Canvas'}</span></div>
        <div class="artwork-meta-item"><label>Style</label><span>${a.style||'Contemporary'}</span></div>
        <div class="artwork-meta-item"><label>Size</label><span>${a.size||'60 × 80 cm'}</span></div>
        <div class="artwork-meta-item"><label>Year</label><span>${a.year||2024}</span></div>
      </div>
      <div class="artwork-desc">${a.description||'A breathtaking work that captures the essence of light and emotion. This piece has been crafted with meticulous attention to detail, showcasing the artist\'s mastery of the medium and their unique vision.'}</div>
      <div class="artwork-actions">
        <div class="row">
          <button class="btn btn-primary btn-block btn-lg" onclick="addToCart({id:${a.id},title:'${a.title}',artist:'${a.artist}',price:'${a.price}',priceNum:${a.priceNum||0},img:'${a.img}'})">🛒 Add to Cart</button>
          <button class="btn btn-outline" onclick="toggleWishlist({id:${a.id},title:'${a.title}',artist:'${a.artist}',price:'${a.price}',img:'${a.img}'},this)" style="min-width:52px;">${wishlisted?'♥':'♡'}</button>
        </div>
        <button class="btn btn-ghost btn-block" onclick="location.href='auction.html'">🔨 Bid in Auction</button>
      </div>
      <div class="artwork-tags" id="artTags"></div>
      <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);padding:1rem;font-size:.85rem;color:var(--text-secondary);">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;">🚚 <span>Free worldwide shipping</span></div>
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;">↩️ <span>30-day hassle-free returns</span></div>
        <div style="display:flex;align-items:center;gap:.5rem;">🔐 <span>Secure payment &amp; authenticity guaranteed</span></div>
      </div>
    </div>`;

  // Render tags
  const tags = (a.tags||['contemporary','art','original']).slice(0,5);
  document.getElementById('artTags').innerHTML = tags.map(t=>`<span class="tag">#${t}</span>`).join('');
}

async function loadRelated(category) {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;
  const res = await apiCall(`/artworks?category=${category}&limit=4`);
  const artworks = res?.ok ? res.data : window.MOCK_ARTWORKS.filter(a=>a.category===category).slice(0,4);
  grid.innerHTML = artworks.length ? artworks.map(a=>artworkCardHTML(a)).join('') : '<p style="color:var(--text-secondary);">No related artworks found.</p>';
}

function renderReviews() {
  const mockReviews = [
    {name:'Ananya S.',avatar:'https://picsum.photos/seed/rev1/42/42',rating:5,date:'April 10, 2025',text:'Absolutely stunning! The colors are vibrant and the technique is masterful. Arrived perfectly packaged.'},
    {name:'Vikram R.',avatar:'https://picsum.photos/seed/rev2/42/42',rating:4,date:'March 28, 2025',text:'Beautiful artwork. Slightly smaller than expected but the quality is excellent.'},
    {name:'Meena P.',avatar:'https://picsum.photos/seed/rev3/42/42',rating:5,date:'March 15, 2025',text:'This piece has transformed my living room. Everyone who visits is mesmerized by it.'},
  ];
  document.getElementById('avgScore').textContent = '4.8';
  document.getElementById('reviewTotal').textContent = `${mockReviews.length} reviews`;
  const bars = document.getElementById('ratingBars');
  if (bars) bars.innerHTML = [5,4,3,2,1].map(r=>`
    <div class="rating-bar-row">
      <span>${r}★</span>
      <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${r===5?75:r===4?18:5}%"></div></div>
      <span>${r===5?75:r===4?18:5}%</span>
    </div>`).join('');
  const list = document.getElementById('reviewsList');
  if (list) list.innerHTML = mockReviews.map(r=>`
    <div class="review-card">
      <div class="review-card__header">
        <img class="review-card__avatar" src="${r.avatar}" alt="${r.name}"/>
        <div><div class="review-card__name">${r.name}</div><div style="color:var(--gold);font-size:.85rem;">${'★'.repeat(r.rating)}</div></div>
        <div class="review-card__date" style="margin-left:auto;">${r.date}</div>
      </div>
      <div class="review-card__text">${r.text}</div>
    </div>`).join('');
}

window.openZoom = function() {
  const img = document.getElementById('mainArtImg')?.src;
  if (!img) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:5000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
  overlay.innerHTML = `<img src="${img}" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;"/>`;
  overlay.onclick = ()=>overlay.remove();
  document.body.appendChild(overlay);
};

window.followArtist = ()=>showToast('Following artist!','success');
window.setRating = function(val){
  selectedRating=val;
  document.querySelectorAll('#starInput .star').forEach((s,i)=>s.classList.toggle('active',i<val));
};
window.submitReview = ()=>{
  if(!selectedRating){showToast('Please select a rating','error');return;}
  showToast('Review submitted! Thank you.','success');
};

// ── ARTISTS PAGE JS ──
let allArtists = [];
window.filterByStyle = function(style, btn) {
  document.querySelectorAll('#styleFilter .cat-pill').forEach(p=>p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = style==='all' ? allArtists : allArtists.filter(a=>a.style===style);
  renderArtistGrid(filtered);
};
window.filterArtists = function() {
  const q = document.getElementById('artistSearch')?.value.toLowerCase().trim()||'';
  renderArtistGrid(allArtists.filter(a=>a.name.toLowerCase().includes(q)||a.style.toLowerCase().includes(q)));
};
function renderArtistGrid(artists) {
  const grid = document.getElementById('artistsGrid');
  if (!grid) return;
  grid.innerHTML = artists.map(a=>`
    <div class="artist-card" onclick="location.href='artist-profile.html?id=${a.id}'">
      <img class="artist-card__avatar" src="${a.img}" alt="${a.name}" loading="lazy"/>
      <div class="artist-card__name">${a.name}</div>
      <div class="artist-card__style">${a.style}</div>
      <div class="artist-card__works">${a.works} works · ${(a.followers||0).toLocaleString()} followers</div>
      <button class="btn btn-outline btn-sm" style="margin-top:1rem;width:100%;" onclick="event.stopPropagation();showToast('Following '+event.currentTarget.closest('.artist-card').querySelector('.artist-card__name').textContent,'success')">+ Follow</button>
    </div>`).join('');
}

async function loadArtistsPage() {
  const grid = document.getElementById('artistsGrid');
  if (!grid) return;
  const res = await apiCall('/artists');
  allArtists = res?.ok ? res.data : window.MOCK_ARTISTS;
  renderArtistGrid(allArtists);
}

// ── ARTIST UPLOAD JS ──
window.previewArtwork = function(input) {
  if (!input.files?.[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('previewImg');
    const content = document.getElementById('dropContent');
    if (img) { img.src = e.target.result; img.style.display = 'block'; }
    if (content) content.style.display = 'none';
  };
  reader.readAsDataURL(input.files[0]);
};
window.handleDragOver = e => e.preventDefault();
window.handleDrop = e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    const inp = document.getElementById('artFile');
    const dt = new DataTransfer();
    dt.items.add(file);
    inp.files = dt.files;
    previewArtwork(inp);
  }
};
window.addExtraImages = function(input) {
  const grid = document.getElementById('extraImgGrid');
  if (!grid || !input.files) return;
  Array.from(input.files).forEach(f => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.style.cssText='aspect-ratio:1;border-radius:var(--radius-md);overflow:hidden;';
      div.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;"/>`;
      grid.insertBefore(div, grid.lastElementChild);
    };
    reader.readAsDataURL(f);
  });
};
window.saveDraft = ()=>showToast('Draft saved!','info');
window.submitArtwork = async()=>{
  const title = document.getElementById('artTitle')?.value;
  const category = document.getElementById('artCategory')?.value;
  const price = document.getElementById('artPrice')?.value;
  if (!title||!category||!price) { showToast('Please fill all required fields','error'); return; }
  const res = await apiCall('/artworks',{method:'POST',body:JSON.stringify({title,category,price})});
  showToast('🎨 Artwork submitted for review!','success');
  setTimeout(()=>location.href='dashboard.html',1500);
};

document.addEventListener('DOMContentLoaded',()=>{
  if (document.getElementById('artworkDetail')) loadArtworkDetail();
  if (document.getElementById('artistsGrid')) loadArtistsPage();
});
