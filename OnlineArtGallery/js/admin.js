// ── ADMIN JS ──
window.showAdmin = function(section, btn) {
  document.querySelectorAll('.dash-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.dash-nav a').forEach(a=>a.classList.remove('active'));
  document.getElementById('sec-'+section)?.classList.add('active');
  if (btn) btn.classList.add('active');
  adminLoaders[section]?.();
};

function barChart(container, data) {
  const max = Math.max(...data.map(d=>d.val));
  container.innerHTML = data.map(d=>`
    <div class="chart-bar-row">
      <label>${d.label}</label>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(d.val/max*100)}%"></div></div>
      <span class="chart-bar-val">${d.display||d.val}</span>
    </div>`).join('');
}

const adminLoaders = {
  overview: async()=>{
    const res = await apiCall('/admin/stats');
    const stats = res?.ok ? res.data : { artworks:1247, users:3821, revenue:2430000, orders:892 };
    document.getElementById('totalArtworks').textContent = stats.artworks?.toLocaleString('en-IN')||'1,247';
    document.getElementById('totalUsers').textContent = stats.users?.toLocaleString('en-IN')||'3,821';
    document.getElementById('totalRevenue').textContent = '₹'+(stats.revenue||2430000).toLocaleString('en-IN');
    document.getElementById('totalOrders').textContent = stats.orders?.toLocaleString('en-IN')||'892';
    document.getElementById('aCount').textContent = '1,247';
    document.getElementById('uCount').textContent = '3,821';
    document.getElementById('oCount').textContent = '892';
    barChart(document.getElementById('topArtworksChart'),[
      {label:'Sunset Reverie',val:42,display:'₹18.9L'},
      {label:'Ancient Whispers',val:38,display:'₹45.6L'},
      {label:'Digital Cosmos',val:31,display:'₹8.1L'},
      {label:'Fractured Light',val:27,display:'₹14.0L'},
      {label:'Abstract Pulse',val:21,display:'₹7.4L'},
    ]);
  },
  artworks: async()=>{
    const grid = document.getElementById('adminArtworksGrid');
    if (!grid) return;
    const artworks = window.MOCK_ARTWORKS;
    grid.innerHTML = artworks.map(a=>`
      <div class="artwork-card">
        <div class="artwork-card__img-wrap">
          <img class="artwork-card__img" src="${a.img}" alt="${a.title}" loading="lazy"/>
          <div style="position:absolute;top:.5rem;left:.5rem;"><span class="badge badge-green" style="font-size:.65rem;">LIVE</span></div>
        </div>
        <div class="artwork-card__info">
          <div class="artwork-card__title">${a.title}</div>
          <div class="artwork-card__artist">${a.artist}</div>
        </div>
        <div class="artwork-card__footer">
          <span class="artwork-card__price">${a.price}</span>
          <div style="display:flex;gap:.35rem;">
            <button class="btn btn-ghost btn-sm" onclick="editArtwork(${a.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteArtwork(${a.id})">🗑️</button>
          </div>
        </div>
      </div>`).join('');
  },
  users: async()=>{
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    const mockUsers = [
      {id:1,name:'Priya Sharma',email:'priya@example.com',role:'ARTIST',joined:'2024-01-15',status:'Active'},
      {id:2,name:'Arjun Mehta',email:'arjun@example.com',role:'COLLECTOR',joined:'2024-02-20',status:'Active'},
      {id:3,name:'Kavya Nair',email:'kavya@example.com',role:'ARTIST',joined:'2024-03-10',status:'Active'},
      {id:4,name:'Rohan Das',email:'rohan@example.com',role:'COLLECTOR',joined:'2024-03-25',status:'Suspended'},
      {id:5,name:'Admin User',email:'admin@artvault.com',role:'ADMIN',joined:'2024-01-01',status:'Active'},
    ];
    tbody.innerHTML = mockUsers.map(u=>`<tr>
      <td><div style="display:flex;align-items:center;gap:.75rem;"><img src="https://picsum.photos/seed/u${u.id}/32/32" style="width:32px;height:32px;border-radius:50%;object-fit:cover;"/><strong>${u.name}</strong></div></td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role==='ADMIN'?'badge-red':u.role==='ARTIST'?'badge-gold':'badge-purple'}">${u.role}</span></td>
      <td style="font-size:.8rem;">${u.joined}</td>
      <td><span class="badge ${u.status==='Active'?'badge-green':'badge-red'}">${u.status}</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="editUser(${u.id})">Edit</button></td>
    </tr>`).join('');
  },
  orders: async()=>{
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    const orders = [
      {id:'ART-104521',customer:'Arjun Mehta',artwork:'Sunset Reverie',amount:'₹45,000',status:'Delivered',date:'2025-04-10'},
      {id:'ART-104389',customer:'Kavya Nair',artwork:'Digital Cosmos',amount:'₹22,500',status:'Shipped',date:'2025-04-15'},
      {id:'ART-104201',customer:'Rohan Das',artwork:'Urban Soul',amount:'₹18,000',status:'Processing',date:'2025-04-20'},
      {id:'ART-104105',customer:'Meena Pillai',artwork:'Ancient Whispers',amount:'₹1,20,000',status:'Delivered',date:'2025-04-08'},
    ];
    const sb = s=>{ const m={Delivered:'badge-green',Shipped:'badge-purple',Processing:'badge-gold',Cancelled:'badge-red'}; return `<span class="badge ${m[s]||'badge-gold'}">${s}</span>`; };
    tbody.innerHTML = orders.map(o=>`<tr>
      <td style="font-family:monospace;font-size:.8rem;">${o.id}</td>
      <td><strong>${o.customer}</strong></td>
      <td>${o.artwork}</td>
      <td style="color:var(--gold);font-weight:700;">${o.amount}</td>
      <td>${sb(o.status)}</td>
      <td style="font-size:.8rem;">${o.date}</td>
      <td><select class="sort-select" style="padding:.35rem .5rem;font-size:.75rem;" onchange="updateOrderStatus('${o.id}',this.value)"><option>Update</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td>
    </tr>`).join('');
  },
  analytics: ()=>{
    barChart(document.getElementById('revByCatChart'),[
      {label:'Painting',val:85,display:'₹84.5L'},{label:'Digital Art',val:60,display:'₹52.2L'},
      {label:'Sculpture',val:45,display:'₹1.2Cr'},{label:'Photography',val:38,display:'₹31.4L'},
      {label:'Abstract',val:32,display:'₹28.7L'},
    ]);
    barChart(document.getElementById('topArtistsChart'),[
      {label:'Rohan Das',val:90,display:'₹1.45Cr'},{label:'Priya Sharma',val:75,display:'₹98.5L'},
      {label:'Vijay Menon',val:65,display:'₹67L'},{label:'Arjun Mehta',val:55,display:'₹52L'},
    ]);
    barChart(document.getElementById('monthlyOrdersChart'),[
      {label:'Jan',val:42},{label:'Feb',val:58},{label:'Mar',val:71},{label:'Apr',val:89},{label:'May',val:0},{label:'Jun',val:0},
    ]);
  },
  auctions: ()=>{
    const grid = document.getElementById('adminAuctionsGrid');
    if (grid) grid.innerHTML = '<p style="color:var(--text-secondary);">Auction management coming soon.</p>';
  },
  exhibitions: ()=>{
    const el = document.getElementById('exhibitionsAdminList');
    if (el) el.innerHTML = '<p style="color:var(--text-secondary);">Exhibition management — use API to manage.</p>';
  },
  categories: ()=>{
    const el = document.getElementById('categoriesAdminList');
    const cats = ['Painting','Sculpture','Photography','Digital Art','Watercolor','Abstract','Prints'];
    if (el) el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;">${cats.map(c=>`<div class="card" style="padding:1.25rem;display:flex;justify-content:space-between;align-items:center;"><span>${c}</span><button class="btn btn-ghost btn-sm">Edit</button></div>`).join('')}</div>`;
  }
};

window.editArtwork = id => showToast('Edit artwork #'+id+' (API feature)','info');
window.deleteArtwork = id => { if (confirm('Delete artwork #'+id+'?')) showToast('Artwork deleted','success'); };
window.editUser = id => showToast('Edit user #'+id+' (API feature)','info');
window.updateOrderStatus = (id,status) => { if (status!=='Update') showToast(`Order ${id} → ${status}`,'success'); };
window.filterAdminArtworks = ()=>{};
window.filterAdminUsers = ()=>{};
window.openCreateAuction = ()=>showToast('Create auction — API feature','info');
window.openCreateExhibition = ()=>showToast('Create exhibition — API feature','info');
window.openCreateCategory = ()=>showToast('Add category — API feature','info');

document.addEventListener('DOMContentLoaded', ()=>{
  adminLoaders.overview();
});
