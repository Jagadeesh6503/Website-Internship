// ===== CHART DEFAULTS =====
Chart.defaults.color = '#8892a4';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = 'Inter';

const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

// ===== VEHICLE FLOW CHART =====
function buildFlowChart() {
  destroyChart('flowChart');
  const d = DATA.generateFlowData(24);
  const ctx = document.getElementById('flowChart').getContext('2d');
  chartInstances.flowChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Actual Flow',
          data: d.actual,
          borderColor: '#00f5ff',
          backgroundColor: 'rgba(0,245,255,0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Predicted Flow',
          data: d.predicted,
          borderColor: '#a855f7',
          backgroundColor: 'transparent',
          borderDash: [5, 4],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { type: 'time', time: { unit: 'hour', displayFormats: { hour: 'HH:mm' } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + ' veh' } }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } },
        tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 10 }
      }
    }
  });
}

// ===== SIGNAL DONUT =====
function buildSignalDonut() {
  destroyChart('signalDonut');
  const ctx = document.getElementById('signalDonut').getContext('2d');
  chartInstances.signalDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Green', 'Yellow', 'Red'],
      datasets: [{
        data: [42, 18, 40],
        backgroundColor: ['rgba(34,197,94,0.85)', 'rgba(234,179,8,0.85)', 'rgba(239,68,68,0.85)'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== HEATMAP (bar matrix simulation) =====
function buildHeatmap() {
  destroyChart('heatmapChart');
  const ctx = document.getElementById('heatmapChart').getContext('2d');
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
  const hours = ['6am','8am','10am','12pm','2pm','4pm','6pm','8pm'];
  const datasets = zones.map((zone, zi) => ({
    label: zone,
    data: hours.map(() => Math.round(50 + Math.random() * 350)),
    backgroundColor: [`rgba(0,245,255,0.7)`, `rgba(168,85,247,0.7)`, `rgba(34,197,94,0.7)`, `rgba(249,115,22,0.7)`][zi],
    borderRadius: 4,
  }));
  chartInstances.heatmapChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: hours, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + ' veh' } }
      },
      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'rect', padding: 12 } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== LSTM FORECAST =====
function buildLSTMChart() {
  destroyChart('lstmChart');
  const d = DATA.generateLSTMForecast();
  const ctx = document.getElementById('lstmChart').getContext('2d');
  chartInstances.lstmChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'Actual', data: d.actual, borderColor: '#00f5ff', backgroundColor: 'rgba(0,245,255,0.06)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 },
        { label: 'Forecast', data: d.forecast, borderColor: '#a855f7', borderDash: [6, 4], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0 },
        { label: 'Upper Bound', data: d.upper, borderColor: 'rgba(168,85,247,0.2)', backgroundColor: 'rgba(168,85,247,0.06)', fill: '+1', tension: 0.4, borderWidth: 1, pointRadius: 0 },
        { label: 'Lower Bound', data: d.lower, borderColor: 'rgba(168,85,247,0.2)', backgroundColor: 'rgba(168,85,247,0.06)', fill: false, tension: 0.4, borderWidth: 1, pointRadius: 0 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { type: 'time', time: { unit: 'hour', displayFormats: { hour: 'MMM d HH:mm' } }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } },
      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle', padding: 14 } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== CONFIDENCE CHART =====
function buildConfidenceChart() {
  destroyChart('confidenceChart');
  const d = DATA.intersections.slice(0, 8);
  const ctx = document.getElementById('confidenceChart').getContext('2d');
  chartInstances.confidenceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.map(x => x.id),
      datasets: [{
        label: 'Confidence %',
        data: d.map(x => x.confidence),
        backgroundColor: d.map(x => x.confidence > 95 ? 'rgba(34,197,94,0.8)' : x.confidence > 90 ? 'rgba(0,245,255,0.8)' : 'rgba(249,115,22,0.8)'),
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      scales: { x: { min: 80, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== ERROR CHART =====
function buildErrorChart() {
  destroyChart('errorChart');
  const d = DATA.generateErrorData();
  const ctx = document.getElementById('errorChart').getContext('2d');
  chartInstances.errorChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.windows,
      datasets: [
        { label: 'MAE', data: d.mae, backgroundColor: 'rgba(0,245,255,0.7)', borderRadius: 6 },
        { label: 'RMSE', data: d.rmse, backgroundColor: 'rgba(168,85,247,0.7)', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + ' veh/h' } } },
      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'rect', padding: 12 } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== PEAK HOURS =====
function buildPeakChart() {
  destroyChart('peakChart');
  const d = DATA.peakHours;
  const ctx = document.getElementById('peakChart').getContext('2d');
  chartInstances.peakChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{ label: 'Vehicles/h', data: d.values, backgroundColor: d.values.map(v => v > 300 ? 'rgba(239,68,68,0.8)' : v > 200 ? 'rgba(249,115,22,0.8)' : 'rgba(0,245,255,0.6)'), borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}

// ===== WEEKLY CHART =====
function buildWeeklyChart() {
  destroyChart('weeklyChart');
  const d = DATA.weeklyPattern;
  const ctx = document.getElementById('weeklyChart').getContext('2d');
  chartInstances.weeklyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [{ label: 'Daily Volume', data: d.values, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.4, borderWidth: 2.5, pointBackgroundColor: '#a855f7', pointRadius: 5 }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}

// ===== INCIDENT CHART =====
function buildIncidentChart() {
  destroyChart('incidentChart');
  const d = DATA.incidents;
  const ctx = document.getElementById('incidentChart').getContext('2d');
  chartInstances.incidentChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: d.labels,
      datasets: [{ data: d.values, backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(249,115,22,0.7)', 'rgba(234,179,8,0.7)', 'rgba(0,245,255,0.7)', 'rgba(168,85,247,0.7)', 'rgba(34,197,94,0.7)'], borderWidth: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 10, font: { size: 11 } } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}

// ===== TREND CHART =====
function buildTrendChart() {
  destroyChart('trendChart');
  const d = DATA.generateTrend();
  const ctx = document.getElementById('trendChart').getContext('2d');
  chartInstances.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.days,
      datasets: [{ label: 'Daily Volume', data: d.vals, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { type: 'time', time: { unit: 'day', displayFormats: { day: 'MMM d' } }, grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}

// ===== EFFICIENCY CHART =====
function buildEfficiencyChart() {
  destroyChart('efficiencyChart');
  const ctx = document.getElementById('efficiencyChart').getContext('2d');
  chartInstances.efficiencyChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Throughput', 'Wait Time', 'Fuel Saving', 'Safety', 'Prediction', 'Uptime'],
      datasets: [
        { label: 'Current', data: [88, 82, 75, 91, 96, 99], borderColor: '#00f5ff', backgroundColor: 'rgba(0,245,255,0.15)', borderWidth: 2, pointBackgroundColor: '#00f5ff' },
        { label: 'Baseline', data: [60, 55, 50, 70, 0, 85], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 2, pointBackgroundColor: '#a855f7', borderDash: [5, 4] }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { grid: { color: 'rgba(255,255,255,0.08)' }, pointLabels: { font: { size: 11 } }, ticks: { display: false }, min: 0, max: 100 } },
      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle', padding: 12 } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }
    }
  });
}

// ===== LOSS CURVE =====
function buildLossChart() {
  destroyChart('lossChart');
  const d = DATA.generateLoss();
  const ctx = document.getElementById('lossChart').getContext('2d');
  chartInstances.lossChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.epochs,
      datasets: [
        { label: 'Training Loss', data: d.train, borderColor: '#00f5ff', backgroundColor: 'rgba(0,245,255,0.06)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 },
        { label: 'Validation Loss', data: d.val, borderColor: '#f97316', backgroundColor: 'transparent', borderDash: [5, 4], tension: 0.4, borderWidth: 2, pointRadius: 0 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Epoch', color: '#8892a4' }, grid: { display: false } }, y: { title: { display: true, text: 'Loss (MSE)', color: '#8892a4' }, grid: { color: 'rgba(255,255,255,0.04)' } } }, plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle', padding: 14 } }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}

// ===== FEATURE IMPORTANCE =====
function buildFeatureChart() {
  destroyChart('featureChart');
  const d = DATA.featureImportance;
  const ctx = document.getElementById('featureChart').getContext('2d');
  chartInstances.featureChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{ label: 'SHAP Value', data: d.values.map(v => +(v * 100).toFixed(1)), backgroundColor: 'rgba(168,85,247,0.75)', borderRadius: 6 }]
    },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161b2e', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } } }
  });
}
