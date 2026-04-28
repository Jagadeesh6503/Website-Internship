// ===== REAL-WORLD APIs =====
// Nominatim (OpenStreetMap)  — city geocoding, FREE, no key
// Open-Meteo                 — real weather data,  FREE, no key
// Overpass API               — real traffic signals, FREE, no key

// ===== STATE =====
let currentCity = {
  name: 'Chennai', state: 'Tamil Nadu', country: 'India',
  lat: 13.0827, lng: 80.2707,
  displayName: 'Chennai, Tamil Nadu'
};
let realWeather = null;
let realSignals = [];

// ===== TIME =====
function updateTime() {
  const el = document.getElementById('timeDisplay');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// ===== NAVIGATION =====
const pageTitles = {
  dashboard: 'Live Traffic Dashboard', predictions: 'Signal Predictions',
  analytics: 'Traffic Analytics', intersections: 'Intersection Monitor',
  model: 'ML Model Console', reports: 'Reports & Exports'
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.getElementById('pageTitle').textContent = pageTitles[page] || page;
    renderPageCharts(page);
  });
});

// ===== CITY SEARCH (Nominatim API) =====
const searchInput = document.getElementById('citySearchInput');
const suggestionsBox = document.getElementById('citySuggestions');
const spinner = document.getElementById('citySearchSpinner');
let searchTimer = null;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = searchInput.value.trim();
  if (q.length < 2) { closeSuggestions(); return; }
  searchTimer = setTimeout(() => searchCities(q), 400);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSuggestions(); searchInput.blur(); }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.city-switcher')) closeSuggestions();
});

async function searchCities(query) {
  spinner.classList.add('active');
  try {
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query + ', India')}&format=json&limit=7` +
      `&addressdetails=1&featuretype=city&countrycodes=in`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    renderSuggestions(data);
  } catch (err) {
    console.warn('Nominatim error:', err);
  } finally {
    spinner.classList.remove('active');
  }
}

function renderSuggestions(results) {
  // Filter to cities/towns in India
  const cities = results.filter(r =>
    ['city', 'town', 'municipality', 'administrative'].includes(r.type) ||
    r.class === 'place' || r.class === 'boundary'
  );
  if (!cities.length) { closeSuggestions(); return; }
  suggestionsBox.innerHTML = cities.slice(0, 6).map(c => {
    const addr = c.address || {};
    const cityName = addr.city || addr.town || addr.municipality || addr.county || c.display_name.split(',')[0];
    const stateName = addr.state || '';
    const district = addr.county || '';
    return `<div class="suggestion-item" data-lat="${c.lat}" data-lng="${c.lon}"
                 data-name="${cityName}" data-state="${stateName}" data-display="${cityName}, ${stateName}">
      <strong>${cityName}</strong>
      <small>${stateName}${district && district !== cityName ? ', ' + district : ''}, India</small>
    </div>`;
  }).join('');
  suggestionsBox.classList.add('open');
  suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const lat = parseFloat(item.dataset.lat);
      const lng = parseFloat(item.dataset.lng);
      selectCity(item.dataset.name, item.dataset.state, lat, lng, item.dataset.display);
      searchInput.value = '';
      closeSuggestions();
    });
  });
}

function closeSuggestions() {
  suggestionsBox.classList.remove('open');
  suggestionsBox.innerHTML = '';
}

// ===== SELECT CITY & FETCH REAL DATA =====
async function selectCity(name, state, lat, lng, displayName) {
  currentCity = { name, state, lat, lng, displayName, country: 'India' };
  currentCityKey = name.toLowerCase();

  // Update all UI text immediately (don't wait for API)
  const lbl = document.getElementById('kpiCityLabel');
  const chg = document.getElementById('kpiCityChange');
  if (lbl) lbl.textContent = name + ' Junctions';
  if (chg) chg.textContent = '↑ Fetching zones...';
  document.getElementById('cityActiveBadge').textContent = '📍 ' + displayName;
  document.getElementById('cityTag').textContent = '📍 ' + name + ', ' + state.substring(0, 2).toUpperCase();
  document.querySelector('.breadcrumb').textContent = `${displayName}, India → Real-time Monitoring`;
  // Show loading in weather bar
  const bar = document.getElementById('weatherBar');
  if (bar) { bar.style.display = 'flex'; document.getElementById('wDesc').textContent = 'Fetching live data for ' + name + '...'; }

  // Fetch real weather + signals in parallel
  await Promise.all([fetchRealWeather(lat, lng), fetchRealSignals(lat, lng)]);
  updateKPIs();
  renderPageCharts(document.querySelector('.nav-item.active')?.dataset.page || 'dashboard');
}

// ===== OPEN-METEO WEATHER API (FREE, NO KEY) =====
async function fetchRealWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code` +
      `&timezone=Asia%2FKolkata&forecast_days=1`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    realWeather = {
      temp: c.temperature_2m,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      rain: c.precipitation,
      code: c.weather_code
    };
    renderWeatherBar(realWeather);
  } catch (err) {
    console.warn('Weather API error:', err);
  }
}

function weatherCodeToEmoji(code) {
  if (code === 0) return { icon: '☀️', desc: 'Clear sky' };
  if (code <= 3) return { icon: '🌤️', desc: 'Partly cloudy' };
  if (code <= 48) return { icon: '🌫️', desc: 'Foggy' };
  if (code <= 57) return { icon: '🌦️', desc: 'Drizzle' };
  if (code <= 67) return { icon: '🌧️', desc: 'Rain' };
  if (code <= 77) return { icon: '🌨️', desc: 'Snow' };
  if (code <= 82) return { icon: '⛈️', desc: 'Heavy rain' };
  return { icon: '⛈️', desc: 'Thunderstorm' };
}

function renderWeatherBar(w) {
  const bar = document.getElementById('weatherBar');
  if (!bar) return;
  bar.style.display = 'flex';
  const { icon, desc } = weatherCodeToEmoji(w.code);
  document.getElementById('wIcon').textContent = icon;
  document.getElementById('wTemp').textContent = w.temp + '°C';
  document.getElementById('wDesc').textContent = desc + ' — ' + currentCity.displayName;
  document.getElementById('wHumidity').textContent = w.humidity + '%';
  document.getElementById('wWind').textContent = w.wind.toFixed(1) + ' km/h';
  document.getElementById('wRain').textContent = w.rain.toFixed(1) + ' mm';
}

// ===== OVERPASS API — REAL TRAFFIC SIGNALS =====
async function fetchRealSignals(lat, lng) {
  try {
    // Query traffic signals within 8km radius
    const q = `[out:json][timeout:15];(node["highway"="traffic_signals"](around:8000,${lat},${lng}););out body 24;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    realSignals = data.elements || [];
    // Inject real signals into DATA
    injectRealSignals(realSignals, lat, lng);
  } catch (err) {
    console.warn('Overpass API error:', err);
    // Fall back to synthetic data for this city
    useSyntheticCityData();
  }
}

function injectRealSignals(nodes, cityLat, cityLng) {
  if (!nodes.length) { useSyntheticCityData(); return; }
  // Take up to 12 signals, closest to city center
  const sorted = nodes
    .map(n => ({ ...n, dist: Math.hypot(n.lat - cityLat, n.lon - cityLng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 12);

  const states = ['green', 'yellow', 'red'];
  const weatherFactor = realWeather ? (realWeather.rain > 2 ? 1.3 : realWeather.rain > 0.5 ? 1.15 : 1.0) : 1.0;

  // Build intersection objects from real OSM nodes
  const cityCode = currentCity.name.substring(0, 3).toUpperCase();
  const mapped = sorted.map((node, i) => {
    const tags = node.tags || {};
    const name = tags.name || tags['name:en'] || tags['addr:street'] || `Signal Node ${i + 1}`;
    const baseVeh = Math.round((150 + Math.random() * 400) * weatherFactor);
    const state = states[Math.floor(Math.random() * 3)];
    const wait = Math.round(baseVeh / 5.5 + Math.random() * 10);
    return {
      id: `${cityCode}-${String(i + 1).padStart(3, '0')}`,
      name: name.length > 35 ? name.substring(0, 33) + '…' : name,
      zone: getZone(node.lat, node.lon, cityLat, cityLng),
      state, vehicles: baseVeh, wait: Math.min(wait, 140),
      confidence: +(88 + Math.random() * 10).toFixed(1),
      lat: node.lat, lng: node.lon, realNode: true
    };
  });

  // Override CITIES_DATA for current city
  CITIES_DATA[currentCity.name.toLowerCase()] = {
    name: currentCity.name, state: currentCity.state, code: cityCode,
    intersections: mapped,
    peakHours: generateLocalPeaks(weatherFactor),
    weekly: [4200,4500,4400,4600,5000,3300,1900],
    incidents: { labels: ['Accidents','Waterlogging','Road Work','Breakdown','VIP','Events'], values: [20,Math.round(realWeather?.rain > 1 ? 35 : 12),18,11,8,6] },
    color: '#00f5ff', flag: '📍'
  };
  currentCityKey = currentCity.name.toLowerCase();
}

function getZone(lat, lng, clat, clng) {
  const dlat = lat - clat, dlng = lng - clng;
  if (Math.abs(dlat) < 0.03 && Math.abs(dlng) < 0.03) return 'Central';
  if (dlat > 0.03) return 'North';
  if (dlat < -0.03) return 'South';
  if (dlng > 0.03) return 'East';
  return 'West';
}

function generateLocalPeaks(wf = 1.0) {
  const base = [28,18,12,9,22,70,160,370,500,420,310,275,295,310,275,295,380,530,510,430,295,195,115,62];
  return base.map(v => Math.round(v * wf));
}

function useSyntheticCityData() {
  // Assign nearest predefined city data or use Chennai as base
  const key = currentCity.name.toLowerCase();
  if (!CITIES_DATA[key]) {
    const base = JSON.parse(JSON.stringify(CITIES_DATA['chennai']));
    base.name = currentCity.name;
    base.state = currentCity.state;
    const code = currentCity.name.substring(0, 3).toUpperCase();
    base.code = code;
    base.intersections = base.intersections.map((it, i) => ({
      ...it, id: `${code}-${String(i + 1).padStart(3, '0')}`
    }));
    CITIES_DATA[key] = base;
  }
  currentCityKey = key;
}

// ===== REFRESH BUTTON — FETCH REAL DATA =====
document.getElementById('refreshBtn').addEventListener('click', async () => {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true; btn.textContent = '⏳ Fetching...';
  await Promise.all([
    fetchRealWeather(currentCity.lat, currentCity.lng),
    fetchRealSignals(currentCity.lat, currentCity.lng)
  ]);
  updateKPIs();
  const activePage = document.querySelector('.nav-item.active')?.dataset.page || 'dashboard';
  renderPageCharts(activePage);
  btn.disabled = false;
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh`;
});

// ===== KPI UPDATE =====
function animateKPI(el, target, suffix = '') {
  if (!el) return;
  const isFloat = target.toString().includes('.');
  const numericTarget = parseFloat(target);
  const start = numericTarget * 0.85;
  let current = start;
  const step = (numericTarget - start) / 40;
  const interval = setInterval(() => {
    current = Math.min(current + step, numericTarget);
    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current).toLocaleString('en-IN')) + suffix;
    if (current >= numericTarget) clearInterval(interval);
  }, 18);
}

function updateKPIs() {
  const city = CITIES_DATA[currentCityKey] || CITIES_DATA['chennai'];

  // Update KPI label to show current city name
  const lbl = document.getElementById('kpiCityLabel');
  const chg = document.getElementById('kpiCityChange');
  if (lbl) lbl.textContent = currentCity.name + ' Junctions';
  if (chg) {
    const zones = [...new Set(city.intersections.map(i => i.zone))].length;
    chg.textContent = `↑ ${zones} zones covered`;
  }

  animateKPI(document.getElementById('kpi-intersections'), city.intersections.length);
  animateKPI(document.getElementById('kpi-accuracy'), 95.8, '%');
  const totalVeh = city.intersections.reduce((s, x) => s + x.vehicles, 0);
  animateKPI(document.getElementById('kpi-vehicles'), totalVeh);
  // Adjust wait time based on real weather
  const waitAdj = realWeather?.rain > 2 ? 58 : realWeather?.rain > 0.5 ? 49 : 43;
  document.getElementById('kpi-wait').textContent = waitAdj + 's';
}

// ===== SIGNALS GRID =====
function buildSignalsGrid() {
  const grid = document.getElementById('signalsGrid');
  if (!grid) return;
  const items = (CITIES_DATA[currentCityKey] || CITIES_DATA['chennai']).intersections.slice(0, 6);
  grid.innerHTML = items.map(node => `
    <div class="signal-node">
      <span class="node-id">${node.id}${node.realNode ? ' <span style="color:#22c55e;font-size:9px">●OSM</span>' : ''}</span>
      <div class="signal-light ${node.state}"></div>
      <div class="node-stats">
        <div><div class="node-count">${node.vehicles}</div><div class="node-label">vehicles/h</div></div>
        <div style="text-align:right"><div class="node-count" style="font-size:15px">${node.wait}s</div><div class="node-label">avg wait</div></div>
      </div>
      <div class="node-name">${node.name}</div>
    </div>`).join('');
}

// ===== PREDICTION TABLE =====
function buildPredTable() {
  const tbody = document.getElementById('predTableBody');
  if (!tbody) return;
  const states = ['green', 'yellow', 'red'];
  const statuses = [{ cls: 'ok', label: 'Optimal' }, { cls: 'warn', label: 'Monitor' }, { cls: 'alert', label: 'Critical' }];
  const rows = (CITIES_DATA[currentCityKey] || CITIES_DATA['chennai']).intersections;
  tbody.innerHTML = rows.map(row => {
    const nextState = states[Math.floor(Math.random() * 3)];
    const status = row.vehicles > 450 ? statuses[2] : row.vehicles > 250 ? statuses[1] : statuses[0];
    return `<tr>
      <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#00f5ff">${row.id}</span></td>
      <td>${row.name}</td>
      <td><span class="state-badge ${row.state}">● ${row.state.charAt(0).toUpperCase() + row.state.slice(1)}</span></td>
      <td><span class="state-badge ${nextState}">● ${nextState.charAt(0).toUpperCase() + nextState.slice(1)}</span></td>
      <td><div class="confidence-bar"><div class="conf-track"><div class="conf-fill" style="width:${row.confidence}%"></div></div><span style="font-size:12px;color:#e8eaf0;min-width:40px">${row.confidence}%</span></div></td>
      <td>${row.vehicles.toLocaleString('en-IN')}</td>
      <td>${row.wait}s</td>
      <td><span class="status-pill ${status.cls}">${status.label}</span></td>
    </tr>`;
  }).join('');
}

// ===== MAP GRID =====
function buildMapGrid() {
  const grid = document.getElementById('mapGrid');
  if (!grid) return;
  const ints = (CITIES_DATA[currentCityKey] || CITIES_DATA['chennai']).intersections;
  grid.innerHTML = ints.map(inter => {
    const s = inter.state;
    const clr = s === 'green' ? '#22c55e' : s === 'yellow' ? '#eab308' : '#ef4444';
    return `<div class="map-node" title="${inter.name}">
      <div class="map-signal ${s}"></div>
      <div class="map-node-id">${inter.id}</div>
      <div class="map-node-vol" style="color:${clr}">${inter.vehicles}</div>
      <div class="node-label" style="font-size:9px;text-align:center;color:#4a5568;line-height:1.2">${inter.zone}</div>
    </div>`;
  }).join('');
}

// ===== MODEL PAGE =====
function buildModelPage() {
  const diag = document.getElementById('archDiagram');
  if (!diag) return;
  diag.innerHTML = DATA.modelLayers.map((l, i) => `
    ${i > 0 ? '<div class="arch-arrow">↓</div>' : ''}
    <div class="arch-layer">
      <div class="layer-icon" style="background:${l.color}22;border:1px solid ${l.color}44">${l.icon}</div>
      <div class="layer-info"><div class="layer-name">${l.name}</div><div class="layer-desc">${l.desc}</div></div>
      <div class="layer-params">${l.params}</div>
    </div>`).join('');
  const list = document.getElementById('metricsList');
  if (list) list.innerHTML = DATA.modelMetrics.map(m =>
    `<div class="metric-row"><span class="metric-name">${m.name}</span><span class="metric-val ${m.cls}">${m.val}</span></div>`
  ).join('');
}

// ===== REPORTS =====
function buildReports() {
  const grid = document.getElementById('reportsGrid');
  if (!grid) return;
  grid.innerHTML = DATA.reports.map(r => `
    <div class="report-card">
      <div class="report-icon">${r.icon}</div>
      <div class="report-title">${r.title}</div>
      <div class="report-desc">${r.desc}</div>
      <div class="report-meta">
        <span class="report-date">${r.date}</span>
        <span class="report-badge ${r.badge}">${r.badge.toUpperCase()}</span>
      </div>
    </div>`).join('');
}

// ===== RENDER PAGE CHARTS =====
function renderPageCharts(page) {
  if (page === 'dashboard') {
    buildFlowChart(); buildSignalDonut(); buildHeatmap(); buildSignalsGrid(); buildPredTable();
  } else if (page === 'predictions') {
    buildLSTMChart(); buildConfidenceChart(); buildErrorChart();
  } else if (page === 'analytics') {
    buildPeakChart(); buildWeeklyChart(); buildIncidentChart(); buildTrendChart(); buildEfficiencyChart();
  } else if (page === 'intersections') {
    buildMapGrid();
  } else if (page === 'model') {
    buildModelPage(); buildLossChart(); buildFeatureChart();
  } else if (page === 'reports') {
    buildReports();
  }
}

// ===== LIVE SIGNAL UPDATES =====
function liveUpdateSignals() {
  const states = ['green', 'yellow', 'red'];
  const city = CITIES_DATA[currentCityKey] || CITIES_DATA['chennai'];
  city.intersections.forEach(n => {
    if (Math.random() < 0.15) {
      n.state = states[Math.floor(Math.random() * 3)];
      n.vehicles = Math.max(10, n.vehicles + Math.round((Math.random() - 0.48) * 25));
    }
  });
  const activePage = document.querySelector('.nav-item.active')?.dataset.page;
  if (activePage === 'dashboard') { buildSignalsGrid(); buildPredTable(); }
}
setInterval(liveUpdateSignals, 5000);

// ===== INIT =====
window.addEventListener('DOMContentLoaded', async () => {
  // Load default city (Chennai) with real data on startup
  updateKPIs();
  renderPageCharts('dashboard');
  // Fetch real data for Chennai in background
  fetchRealWeather(currentCity.lat, currentCity.lng);
  fetchRealSignals(currentCity.lat, currentCity.lng);
});
