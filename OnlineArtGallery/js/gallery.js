let allArtworks = [], currentView = 'masonry', page = 1, pageSize = 12;

async function loadGallery() {
  const params = buildParams();
  const res = await apiCall(`/artworks?${params}`);
  allArtworks = res?.ok ? res.data : window.MOCK_ARTWORKS;
  applyFilters();
}

function buildParams() {
  const q = document.getElementById('gallerySearch')?.value?.trim() || '';
  const sort = document.getElementById('sortSelect')?.value || 'newest';
  return new URLSearchParams({ q, sort, page, size: pageSize }).toString();
}

window.applyFilters = function () {
  const q = document.getElementById('gallerySearch')?.value?.toLowerCase().trim() || '';
  const sort = document.getElementById('sortSelect')?.value || 'newest';
  const priceMin = parseInt(document.getElementById('priceMin')?.value || 0);
  const priceMax = parseInt(document.getElementById('priceMax')?.value || 999999);
  const checkedCats = [...document.querySelectorAll('#catFilters input:checked')].map(i => i.value);

  let filtered = allArtworks.filter(a => {
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q);
    const matchCat = !checkedCats.length || checkedCats.includes(a.category);
    const matchPrice = (a.priceNum || 0) >= priceMin && (a.priceNum || 999999) <= priceMax;
    return matchQ && matchCat && matchPrice;
  });

  // Sort
  if (sort === 'price_asc') filtered.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
  else if (sort === 'price_desc') filtered.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
  else if (sort === 'popular') filtered.sort((a, b) => (b.views || 0) - (a.views || 0));

  renderGallery(filtered);
};

window.clearFilters = function () {
  document.querySelectorAll('.filter-opt input').forEach(i => i.checked = false);
  if (document.getElementById('priceMin')) document.getElementById('priceMin').value = 0;
  if (document.getElementById('priceMax')) document.getElementById('priceMax').value = 100000;
  if (document.getElementById('gallerySearch')) document.getElementById('gallerySearch').value = '';
  applyFilters();
};

function renderGallery(artworks) {
  const grid = document.getElementById('galleryGrid');
  const count = document.getElementById('galleryCount');
  if (count) count.textContent = `${artworks.length} artworks found`;
  if (!grid) return;
  if (!artworks.length) {
    grid.innerHTML = '<div class="no-results"><h3>No artworks found</h3><p>Try adjusting your filters or search terms.</p></div>';
    return;
  }
  grid.innerHTML = artworks.map(a => artworkCardHTML(a)).join('');
  grid.className = `artworks-grid ${currentView === 'masonry' ? 'masonry' : ''}`;
}

window.setView = function (view) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view${view.charAt(0).toUpperCase() + view.slice(1)}`)?.classList.add('active');
  applyFilters();
};

window.updatePriceRange = function (val) {
  const max = document.getElementById('priceMax');
  if (max) max.value = val;
  applyFilters();
};

window.loadMore = function () { page++; loadGallery(); };

// ── QUICK VIEW ──
window.openQuickView = function (id) {
  const a = allArtworks.find(x => x.id === id);
  if (!a) return;
  const body = document.getElementById('quickViewBody');
  if (!body) return;
  body.innerHTML = `
    <div class="quick-view-img"><img src="${a.img}" alt="${a.title}" style="width:100%;height:350px;object-fit:cover;"/></div>
    <div class="quick-view-info">
      <h2>${a.title}</h2>
      <div class="quick-view-meta">
        <span><strong>Artist:</strong> ${a.artist}</span>
        <span><strong>Category:</strong> ${a.category}</span>
        <span><strong>Medium:</strong> ${a.medium || 'N/A'}</span>
        <span><strong>Style:</strong> ${a.style || 'N/A'}</span>
      </div>
      <div class="quick-view-price">${a.price}</div>
      <div class="quick-view-actions">
        <button class="btn btn-primary btn-block" onclick="addToCart({id:${a.id},title:'${a.title}',artist:'${a.artist}',price:'${a.price}',img:'${a.img}'});closeModal('quickViewModal');">🛒 Add to Cart</button>
        <a href="artwork-detail.html?id=${a.id}" class="btn btn-outline btn-block">View Full Details</a>
      </div>
    </div>`;
  openModal('quickViewModal');
};

// ── URL PARAMS ──
function parseURLParams() {
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const cat = params.get('cat');
  if (q && document.getElementById('gallerySearch')) { document.getElementById('gallerySearch').value = q; }
  if (cat) { const cb = document.querySelector(`#catFilters input[value="${cat}"]`); if (cb) cb.checked = true; }
}

document.addEventListener('DOMContentLoaded', () => {
  parseURLParams();
  loadGallery();
});
