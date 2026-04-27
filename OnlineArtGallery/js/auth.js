// ── AUTH JS ──
let selectedRole = 'COLLECTOR';
let currentRegStep = 1;
let selectedRating = 0;

window.handleLogin = async function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginSubmitBtn');
  btn.textContent = 'Signing in…'; btn.disabled = true;

  const res = await apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  btn.textContent = 'Sign In →'; btn.disabled = false;

  if (res?.ok) {
    localStorage.setItem('artToken', res.data.token);
    localStorage.setItem('artUser', JSON.stringify(res.data.user));
    showToast('Welcome back, ' + res.data.user.firstName + '!', 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);
  } else {
    // DEMO MODE: mock login
    const mockUser = { id: 1, firstName: 'Demo', lastName: 'User', email, role: 'COLLECTOR', avatar: 'https://picsum.photos/seed/user/40/40' };
    localStorage.setItem('artToken', 'mock-token-' + Date.now());
    localStorage.setItem('artUser', JSON.stringify(mockUser));
    showToast('Welcome back!', 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);
  }
};

window.selectRole = function (role, el) {
  selectedRole = role;
  document.querySelectorAll('.role-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
};

window.nextStep = function (step) {
  if (step === 3) {
    const email = document.getElementById('regEmail')?.value;
    const pwd = document.getElementById('regPassword')?.value;
    if (!email || !pwd) { showToast('Please fill all required fields', 'error'); return; }
  }
  document.getElementById('step' + currentRegStep).style.display = 'none';
  currentRegStep = step;
  document.getElementById('step' + step).style.display = 'block';
  document.querySelectorAll('.step-dot').forEach((d, i) => {
    d.classList.toggle('active', i + 1 === step);
    d.classList.toggle('done', i + 1 < step);
  });
};

window.checkStrength = function (pwd) {
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  if (!fill) return;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['var(--red)', '#e67e22', '#3498db', 'var(--green)'];
  fill.style.width = (score * 25) + '%';
  fill.style.background = colors[score - 1] || 'var(--border)';
  if (text) text.textContent = labels[score - 1] || '';
};

window.handleRegister = async function () {
  if (!document.getElementById('agreeTerms')?.checked) { showToast('Please accept the terms', 'error'); return; }
  const firstName = document.getElementById('regFirstName')?.value.trim();
  const lastName = document.getElementById('regLastName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  const password = document.getElementById('regPassword')?.value;
  const phone = document.getElementById('regPhone')?.value;
  const country = document.getElementById('regCountry')?.value;

  const res = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password, phone, country, role: selectedRole })
  });

  if (res?.ok) {
    localStorage.setItem('artToken', res.data.token);
    localStorage.setItem('artUser', JSON.stringify(res.data.user));
    showToast('Account created! Welcome to ArtVault!', 'success');
  } else {
    // Demo mock
    const mockUser = { id: Date.now(), firstName, lastName, email, role: selectedRole, avatar: '' };
    localStorage.setItem('artToken', 'mock-token-' + Date.now());
    localStorage.setItem('artUser', JSON.stringify(mockUser));
    showToast('🎉 Account created! Welcome to ArtVault!', 'success');
  }
  setTimeout(() => location.href = 'dashboard.html', 1200);
};

// ── REVIEW RATING ──
window.setRating = function (val) {
  selectedRating = val;
  document.querySelectorAll('#starInput .star').forEach((s, i) => s.classList.toggle('active', i < val));
};

window.submitReview = async function () {
  if (!selectedRating) { showToast('Please select a rating', 'error'); return; }
  const title = document.getElementById('reviewTitle')?.value;
  const text = document.getElementById('reviewText')?.value;
  if (!text) { showToast('Please write your review', 'error'); return; }
  showToast('Review submitted! Thank you.', 'success');
  if (document.getElementById('reviewTitle')) document.getElementById('reviewTitle').value = '';
  if (document.getElementById('reviewText')) document.getElementById('reviewText').value = '';
  selectedRating = 0;
  document.querySelectorAll('#starInput .star').forEach(s => s.classList.remove('active'));
};
