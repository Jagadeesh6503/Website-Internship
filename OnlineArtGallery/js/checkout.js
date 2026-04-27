// ── CHECKOUT JS ──
let checkoutStep = 1;
let paymentMethod = 'card';

function parsePrice(str) { return parseInt(String(str).replace(/[^\d]/g,''))||0; }
function fmtPrice(n) { return '₹'+n.toLocaleString('en-IN'); }

function renderCheckoutSummary() {
  const cart = getCart();
  const itemsEl = document.getElementById('checkoutCartItems');
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(i=>`
      <div style="display:flex;gap:.75rem;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--border);">
        <img src="${i.img}" alt="${i.title}" style="width:48px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;"/>
        <div style="flex:1;font-size:.8rem;"><div style="font-weight:500;">${i.title}</div><div style="color:var(--text-muted);">Qty: ${i.qty||1}</div></div>
        <div style="font-size:.85rem;font-weight:700;color:var(--gold);">${i.price}</div>
      </div>`).join('');
  }
  const subtotal = cart.reduce((s,i)=>s+((i.priceNum||parsePrice(i.price))*(i.qty||1)),0);
  const tax = Math.round(subtotal*0.18);
  const set = (id,v)=>{const e=document.getElementById(id);if(e)e.textContent=fmtPrice(v);};
  set('coSubtotal',subtotal); set('coTax',tax); set('coTotal',subtotal+tax);
}

window.goToStep = function(step) {
  if (step === 2) {
    if (!document.getElementById('shipFirstName')?.value) { showToast('Please fill shipping details','error'); return; }
  }
  document.getElementById('checkoutStep'+checkoutStep).style.display = 'none';
  checkoutStep = step;
  document.getElementById('checkoutStep'+step).style.display = 'block';
  // Update progress
  ['pstep1','pstep2','pstep3'].forEach((id,i)=>{
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active','done');
    if (i+1 === step) el.classList.add('active');
    if (i+1 < step) el.classList.add('done');
  });
};

window.selectPayment = function(method, el) {
  paymentMethod = method;
  document.querySelectorAll('.payment-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('cardForm').style.display = method==='card'?'block':'none';
  document.getElementById('upiForm').style.display = method==='upi'?'block':'none';
};

window.placeOrder = async function() {
  if (!isLoggedIn()) { showToast('Please login to place order','error'); location.href='login.html'; return; }
  const cart = getCart();
  const orderData = {
    items: cart,
    shipping: {
      firstName: document.getElementById('shipFirstName')?.value,
      lastName: document.getElementById('shipLastName')?.value,
      email: document.getElementById('shipEmail')?.value,
      street: document.getElementById('shipStreet')?.value,
      city: document.getElementById('shipCity')?.value,
      state: document.getElementById('shipState')?.value,
      pin: document.getElementById('shipPin')?.value,
      country: document.getElementById('shipCountry')?.value,
    },
    paymentMethod
  };
  const res = await apiCall('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  const orderId = res?.ok ? res.data.orderId : ('ART-' + Date.now().toString().slice(-6));
  // Clear cart
  localStorage.removeItem('artGalleryCart');
  updateBadges();
  // Show confirmation
  document.getElementById('checkoutStep2').style.display = 'none';
  checkoutStep = 3;
  document.getElementById('checkoutStep3').style.display = 'block';
  document.getElementById('confirmOrderId').textContent = 'Order #' + orderId;
  document.querySelectorAll('[id^=pstep]').forEach(e=>e.classList.remove('active'));
  document.getElementById('pstep3')?.classList.add('active');
  showToast('🎉 Order placed successfully!','success');
};

window.formatCard = function(input) {
  let val = input.value.replace(/\D/g,'').slice(0,16);
  input.value = val.replace(/(\d{4})/g,'$1 ').trim();
};

document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
