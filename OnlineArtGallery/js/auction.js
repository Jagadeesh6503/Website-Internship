// ── MOCK AUCTIONS ──
const MOCK_AUCTIONS = [
  {id:1,title:'Sunset Reverie',artist:'Priya Sharma',img:'https://picsum.photos/seed/auc1/600/400',currentBid:52000,startBid:30000,bids:14,endsAt:Date.now()+3600000*2,status:'live'},
  {id:2,title:'Ancient Whispers',artist:'Rohan Das',img:'https://picsum.photos/seed/auc2/600/400',currentBid:145000,startBid:100000,bids:28,endsAt:Date.now()+3600000*5,status:'live'},
  {id:3,title:'Digital Cosmos',artist:'Arjun Mehta',img:'https://picsum.photos/seed/auc3/600/400',currentBid:28500,startBid:15000,bids:9,endsAt:Date.now()+3600000*1,status:'live'},
  {id:4,title:'Fractured Light',artist:'Vijay Menon',img:'https://picsum.photos/seed/auc4/600/400',currentBid:67000,startBid:50000,bids:21,endsAt:Date.now()+3600000*8,status:'upcoming'},
  {id:5,title:'Urban Soul',artist:'Kavya Nair',img:'https://picsum.photos/seed/auc5/600/400',currentBid:20000,startBid:20000,bids:0,endsAt:Date.now()+3600000*24,status:'upcoming'},
  {id:6,title:'Village Morning',artist:'Sunita Rao',img:'https://picsum.photos/seed/auc6/600/400',currentBid:41000,startBid:25000,bids:33,endsAt:Date.now()-3600000*2,status:'ended'},
];

let currentAuctionId = null;
const timers = {};

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function auctionCardHTML(a) {
  return `
    <div class="auction-card ${a.status === 'live' ? 'live' : ''}">
      <div style="position:relative;overflow:hidden;">
        <img class="auction-card__img" src="${a.img}" alt="${a.title}"/>
        <div class="auction-card__status">
          ${a.status === 'live' ? '<span class="live-badge">🔴 Live</span>' : a.status === 'upcoming' ? '<span class="badge badge-purple">⏰ Upcoming</span>' : '<span class="badge badge-green">✅ Ended</span>'}
        </div>
      </div>
      <div class="auction-card__body">
        <div class="auction-card__title">${a.title}</div>
        <div class="auction-card__artist">by ${a.artist}</div>
        <div class="auction-card__bids">
          <div class="auction-bid-info"><label>Current Bid</label><div class="value">${fmt(a.currentBid)}</div></div>
          <div class="auction-bid-info"><label>Total Bids</label><div class="value">${a.bids}</div></div>
        </div>
        ${a.status !== 'ended' ? `<div class="countdown" id="cd-${a.id}"></div>` : '<p style="text-align:center;color:var(--text-muted);font-size:.875rem;margin-bottom:1rem;">This auction has ended</p>'}
        ${a.status === 'live' ? `
          <div class="bid-input-row">
            <input type="number" id="bid-${a.id}" placeholder="Min: ${fmt(a.currentBid + 500)}" min="${a.currentBid + 500}"/>
            <button class="btn btn-primary btn-sm" onclick="openBidModal(${a.id})">🔨 Bid</button>
          </div>` : a.status === 'upcoming' ? `
          <button class="btn btn-outline btn-block" onclick="showToast('Auction not started yet. Set a reminder!','info')">🔔 Remind Me</button>` : `
          <button class="btn btn-ghost btn-block" disabled>Auction Ended</button>`}
      </div>
    </div>`;
}

function startCountdown(id, endsAt) {
  function tick() {
    const el = document.getElementById('cd-' + id);
    if (!el) return;
    const rem = Math.max(0, endsAt - Date.now());
    const h = Math.floor(rem / 3600000), m = Math.floor((rem % 3600000) / 60000), s = Math.floor((rem % 60000) / 1000);
    el.innerHTML = `
      <div class="countdown__unit"><span class="countdown__num">${String(h).padStart(2,'0')}</span><span class="countdown__label">Hrs</span></div>
      <div class="countdown__unit"><span class="countdown__num">${String(m).padStart(2,'0')}</span><span class="countdown__label">Min</span></div>
      <div class="countdown__unit"><span class="countdown__num">${String(s).padStart(2,'0')}</span><span class="countdown__label">Sec</span></div>`;
    if (rem > 0) timers[id] = setTimeout(tick, 1000);
  }
  tick();
}

function renderAuctions(tab) {
  const ids = { live: 'liveAuctions', upcoming: 'upcomingAuctions', ended: 'endedAuctions' };
  const el = document.getElementById(ids[tab]);
  if (!el) return;
  const data = MOCK_AUCTIONS.filter(a => a.status === tab);
  if (!data.length) { el.innerHTML = `<div class="no-results"><h3>No ${tab} auctions</h3></div>`; return; }
  el.innerHTML = data.map(auctionCardHTML).join('');
  data.filter(a => a.status !== 'ended').forEach(a => startCountdown(a.id, a.endsAt));
}

async function loadAuctions() {
  const res = await apiCall('/auctions');
  if (res?.ok) {
    // Use API data if available
    ['live','upcoming','ended'].forEach(tab => renderAuctions(tab));
  } else {
    ['live','upcoming','ended'].forEach(tab => renderAuctions(tab));
  }
}

// ── BID MODAL ──
window.openBidModal = function (id) {
  if (!isLoggedIn()) { showToast('Please login to place a bid', 'error'); location.href = 'login.html'; return; }
  const a = MOCK_AUCTIONS.find(x => x.id === id);
  if (!a) return;
  currentAuctionId = id;
  document.getElementById('bidModalTitle').textContent = 'Bid: ' + a.title;
  document.getElementById('bidModalImg').src = a.img;
  document.getElementById('bidModalCurrent').textContent = fmt(a.currentBid);
  document.getElementById('bidAmount').value = '';
  document.getElementById('bidAmount').min = a.currentBid + 500;
  document.getElementById('bidAmount').placeholder = 'Min: ' + fmt(a.currentBid + 500);
  // Bid history mock
  const hist = document.getElementById('bidHistory');
  hist.innerHTML = `<h4 style="font-size:.85rem;font-weight:600;margin-bottom:.75rem;color:var(--text-secondary);">BID HISTORY</h4>` +
    Array.from({length:5},(_,i)=>`
    <div class="bid-row">
      <div class="bid-row__user"><img src="https://picsum.photos/seed/bid${i}/30/30" alt="Bidder"/>Bidder ${i+1}</div>
      <div class="bid-row__amount">${fmt(a.currentBid - i*500)}</div>
      <div class="bid-row__time">${i*3+2} mins ago</div>
    </div>`).join('');
  openModal('bidModal');
};

window.placeBid = async function () {
  const a = MOCK_AUCTIONS.find(x => x.id === currentAuctionId);
  if (!a) return;
  const amount = parseInt(document.getElementById('bidAmount').value);
  if (!amount || amount < a.currentBid + 500) { showToast(`Minimum bid is ${fmt(a.currentBid + 500)}`, 'error'); return; }
  const res = await apiCall(`/auctions/${currentAuctionId}/bid`, { method: 'POST', body: JSON.stringify({ amount }) });
  a.currentBid = amount; a.bids++;
  closeModal('bidModal');
  showToast(`🎉 Bid of ${fmt(amount)} placed successfully!`, 'success');
  renderAuctions('live');
};

window.showTab = showTab;

document.addEventListener('DOMContentLoaded', loadAuctions);
