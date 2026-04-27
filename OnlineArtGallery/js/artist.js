// artist.js - Artist upload page
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
    const dt = new DataTransfer(); dt.items.add(file); inp.files = dt.files;
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
      div.style.cssText = 'aspect-ratio:1;border-radius:var(--radius-md);overflow:hidden;';
      div.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;"/>`;
      grid.insertBefore(div, grid.lastElementChild);
    };
    reader.readAsDataURL(f);
  });
};
window.saveDraft = () => showToast('Draft saved!', 'info');
window.submitArtwork = async () => {
  const title = document.getElementById('artTitle')?.value?.trim();
  const category = document.getElementById('artCategory')?.value;
  const price = document.getElementById('artPrice')?.value;
  if (!title || !category || !price) { showToast('Please fill all required fields', 'error'); return; }
  const prog = document.getElementById('uploadProgress');
  if (prog) { prog.style.display = 'block'; simulateUpload(); }
  const res = await apiCall('/artworks', { method: 'POST', body: JSON.stringify({ title, category, price }) });
  showToast('🎨 Artwork submitted for review!', 'success');
  setTimeout(() => location.href = 'dashboard.html', 1500);
};
function simulateUpload() {
  let p = 0;
  const fill = document.getElementById('progressFill');
  const pct = document.getElementById('progressPct');
  const t = setInterval(() => {
    p = Math.min(p + Math.random() * 15, 100);
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p) + '%';
    if (p >= 100) clearInterval(t);
  }, 200);
}
