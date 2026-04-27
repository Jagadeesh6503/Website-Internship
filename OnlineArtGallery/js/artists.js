// artists.js - Artists page
async function loadArtistsGrid() {
  const grid = document.getElementById('artistsGrid');
  if (!grid) return;
  const res = await apiCall('/artists');
  const artists = res?.ok ? res.data : window.MOCK_ARTISTS;
  grid.innerHTML = artists.map(a=>`
    <div class="artist-card" onclick="location.href='artist-profile.html?id=${a.id}'">
      <img class="artist-card__avatar" src="${a.img}" alt="${a.name}" loading="lazy"/>
      <div class="artist-card__name">${a.name}</div>
      <div class="artist-card__style">${a.style}</div>
      <div class="artist-card__works">${a.works} works · ${(a.followers||0).toLocaleString()} followers</div>
    </div>`).join('');
}
document.addEventListener('DOMContentLoaded', loadArtistsGrid);
