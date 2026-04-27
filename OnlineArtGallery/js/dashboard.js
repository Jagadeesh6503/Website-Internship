// ── DASHBOARD JS ──
window.showDash = function(section, btn) {
  document.querySelectorAll('.dash-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.dash-nav a').forEach(a=>a.classList.remove('active'));
  document.getElementById('sec-'+section)?.classList.add('active');
  if (btn) btn.classList.add('active');
  loaders[section]?.();
};

const MOCK_ORDERS = [
  {id:'ART-104521',artwork:'Sunset Reverie',artist:'Priya Sharma',amount:'₹45,000',status:'Delivered',date:'2025-04-10',img:'https://picsum.photos/seed/art10/60/45'},
  {id:'ART-104389',artwork:'Digital Cosmos',artist:'Arjun Mehta',amount:'₹22,500',status:'Shipped',date:'2025-04-15',img:'https://picsum.photos/seed/art11/60/45'},
  {id:'ART-104201',artwork:'Urban Soul',artist:'Kavya Nair',amount:'₹18,000',status:'Processing',date:'2025-04-20',img:'https://picsum.photos/seed/art12/60/45'},
];

function statusBadge(s) {
  const map = {Delivered:'badge-green',Shipped:'badge-purple',Processing:'badge-gold',Cancelled:'badge-red'};
  return `<span class="badge ${map[s]||'badge-gold'}">${s}</span>`;
}

const loaders = {
  overview: async()=>{
    const user = getUser(); if (!user) return;
    document.getElementById('welcomeName').textContent = user.firstName || 'User';
    document.getElementById('sidebarName').textContent = (user.firstName||'')+' '+(user.lastName||'');
    document.getElementById('sidebarRole').textContent = user.role||'Collector';
    document.getElementById('dStatOrders').textContent = MOCK_ORDERS.length;
    document.getElementById('dStatWish').textContent = getWishlist().length;
    document.getElementById('dStatReviews').textContent = 3;
    document.getElementById('dStatBids').textContent = 2;
    const ordersEl = document.getElementById('recentOrdersTable');
    if (ordersEl) {
      ordersEl.innerHTML = `<table class="data-table">
        <thead><tr><th>Order ID</th><th>Artwork</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${MOCK_ORDERS.slice(0,3).map(o=>`<tr>
          <td style="font-size:.8rem;font-family:monospace;">${o.id}</td>
          <td><strong>${o.artwork}</strong></td>
          <td style="color:var(--gold);font-weight:600;">${o.amount}</td>
          <td>${statusBadge(o.status)}</td>
          <td style="font-size:.8rem;">${o.date}</td>
        </tr>`).join('')}</tbody>
      </table>`;
    }
  },
  orders: ()=>{
    const el = document.getElementById('ordersTableWrap');
    if (!el) return;
    el.innerHTML = `<table class="data-table">
      <thead><tr><th>Order ID</th><th>Artwork</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
      <tbody>${MOCK_ORDERS.map(o=>`<tr>
        <td style="font-family:monospace;font-size:.8rem;">${o.id}</td>
        <td><div style="display:flex;align-items:center;gap:.75rem;"><img src="${o.img}" style="width:48px;height:36px;object-fit:cover;border-radius:6px;"/><strong>${o.artwork}</strong></div></td>
        <td style="color:var(--gold);font-weight:700;">${o.amount}</td>
        <td>${statusBadge(o.status)}</td>
        <td>${o.date}</td>
        <td><button class="btn btn-ghost btn-sm">View</button></td>
      </tr>`).join('')}</tbody>
    </table>`;
  },
  profile: ()=>{
    const user = getUser(); if (!user) return;
    ['profFirstName','profLastName','profEmail','profPhone'].forEach(id=>{
      const field = id.replace('prof','').charAt(0).toLowerCase()+id.replace('prof','').slice(1);
      const el = document.getElementById(id);
      if (el) el.value = user[field] || '';
    });
  },
  artist: ()=>{
    document.getElementById('aStatWorks').textContent = 8;
    document.getElementById('aStatEarnings').textContent = '₹3,42,000';
    document.getElementById('aStatViews').textContent = '12,450';
    const grid = document.getElementById('artistWorksGrid');
    if (grid) grid.innerHTML = window.MOCK_ARTWORKS.slice(0,6).map(a=>artworkCardHTML(a)).join('');
  },
  reviews: ()=>{
    const el = document.getElementById('reviewsWrap');
    if (!el) return;
    el.innerHTML = [
      {title:'Sunset Reverie',text:'Absolutely stunning piece! The colors are even more vivid in person.',rating:5,date:'2025-04-10'},
      {title:'Digital Cosmos',text:'Great work, very creative and detailed.',rating:4,date:'2025-03-22'},
    ].map(r=>`<div class="card" style="margin-bottom:1rem;padding:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem;">
        <div><strong>${r.title}</strong><div style="color:var(--gold);font-size:.9rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div>
        <span style="font-size:.8rem;color:var(--text-muted);">${r.date}</span>
      </div>
      <p style="color:var(--text-secondary);font-size:.9rem;">${r.text}</p>
    </div>`).join('');
  }
};

window.saveProfile = async function() {
  const user = getUser();
  if (!user) return;
  user.firstName = document.getElementById('profFirstName')?.value;
  user.lastName = document.getElementById('profLastName')?.value;
  user.email = document.getElementById('profEmail')?.value;
  localStorage.setItem('artUser', JSON.stringify(user));
  await apiCall('/users/profile', { method: 'PUT', body: JSON.stringify(user) });
  showToast('Profile updated!', 'success');
  updateNavAuth();
};

window.previewAvatar = function(input) {
  if (!input.files?.[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('profileAvatar');
    if (img) img.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
};

document.addEventListener('DOMContentLoaded', ()=>{
  if (!isLoggedIn()) { location.href='login.html'; return; }
  loaders.overview();
  // Show admin/artist links
  const user = getUser();
  if (user?.role === 'ADMIN') { document.getElementById('adminMenuLink')?.style.setProperty('display','flex'); }
  if (user?.role === 'ARTIST' || user?.role === 'ADMIN') { document.getElementById('artistMenuLink')?.style.setProperty('display','flex'); }
});
