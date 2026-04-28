// ===== MULTI-CITY INDIA TRAFFIC DATA ENGINE =====

const CITIES_DATA = {
  chennai: {
    name: 'Chennai', state: 'Tamil Nadu', code: 'CHN',
    intersections: [
      { id: 'CHN-001', name: 'Koyambedu Junction',       zone: 'West',    state: 'red',    vehicles: 512, wait: 88, confidence: 94.2 },
      { id: 'CHN-002', name: 'Vadapalani Signal',         zone: 'West',    state: 'green',  vehicles: 348, wait: 42, confidence: 96.1 },
      { id: 'CHN-003', name: 'Anna Nagar Tower Park',     zone: 'North',   state: 'yellow', vehicles: 219, wait: 31, confidence: 91.4 },
      { id: 'CHN-004', name: 'Guindy Signal (GST Road)',  zone: 'South',   state: 'red',    vehicles: 487, wait: 76, confidence: 95.7 },
      { id: 'CHN-005', name: 'T. Nagar Pondy Bazaar',     zone: 'Central', state: 'red',    vehicles: 623, wait: 95, confidence: 97.3 },
      { id: 'CHN-006', name: 'Adyar Signal',              zone: 'South',   state: 'green',  vehicles: 178, wait: 28, confidence: 98.1 },
      { id: 'CHN-007', name: 'Tambaram Junction',         zone: 'South',   state: 'yellow', vehicles: 312, wait: 55, confidence: 90.8 },
      { id: 'CHN-008', name: 'Sholinganallur Jn. (OMR)', zone: 'OMR',     state: 'red',    vehicles: 441, wait: 82, confidence: 93.5 },
      { id: 'CHN-009', name: 'Porur Junction',            zone: 'West',    state: 'green',  vehicles: 267, wait: 38, confidence: 95.2 },
      { id: 'CHN-010', name: 'Perambur Signal',           zone: 'North',   state: 'green',  vehicles: 198, wait: 33, confidence: 97.8 },
      { id: 'CHN-011', name: 'Velachery Main Road Jn.',   zone: 'South',   state: 'red',    vehicles: 388, wait: 68, confidence: 92.3 },
      { id: 'CHN-012', name: 'Tidel Park Signal (OMR)',   zone: 'OMR',     state: 'green',  vehicles: 144, wait: 21, confidence: 98.9 },
    ],
    peakHours: [35,22,15,12,25,70,160,340,490,420,310,270,295,310,270,295,380,530,510,440,300,200,120,65],
    weekly: [4120,4380,4290,4450,4980,3210,1850],
    incidents: { labels: ['Accidents','Waterlogging','Road Work','Festival','Breakdown','VIP Movement'], values: [22,31,18,14,11,8] },
    color: '#f97316', flag: '🌊'
  },
  mumbai: {
    name: 'Mumbai', state: 'Maharashtra', code: 'MUM',
    intersections: [
      { id: 'MUM-001', name: 'Dadar TT Circle',           zone: 'Central', state: 'red',    vehicles: 680, wait: 110, confidence: 93.1 },
      { id: 'MUM-002', name: 'Kurla Station Junction',     zone: 'East',    state: 'red',    vehicles: 590, wait:  98, confidence: 91.7 },
      { id: 'MUM-003', name: 'Bandra Linking Road',        zone: 'West',    state: 'yellow', vehicles: 412, wait:  62, confidence: 95.4 },
      { id: 'MUM-004', name: 'Andheri Junction (SV Rd)',   zone: 'West',    state: 'red',    vehicles: 558, wait:  89, confidence: 94.2 },
      { id: 'MUM-005', name: 'Thane Kalwa Junction',       zone: 'Thane',   state: 'green',  vehicles: 321, wait:  48, confidence: 96.8 },
      { id: 'MUM-006', name: 'Powai Hiranandani Signal',   zone: 'East',    state: 'yellow', vehicles: 289, wait:  44, confidence: 92.5 },
      { id: 'MUM-007', name: 'Borivali Station Jn.',       zone: 'North',   state: 'red',    vehicles: 497, wait:  81, confidence: 90.3 },
      { id: 'MUM-008', name: 'Worli Sea Link Entry',       zone: 'South',   state: 'green',  vehicles: 388, wait:  52, confidence: 97.1 },
      { id: 'MUM-009', name: 'Ghatkopar Junction',         zone: 'East',    state: 'red',    vehicles: 521, wait:  86, confidence: 93.8 },
      { id: 'MUM-010', name: 'Mulund Check Naka',          zone: 'Thane',   state: 'yellow', vehicles: 248, wait:  39, confidence: 89.6 },
      { id: 'MUM-011', name: 'Juhu Circle',                zone: 'West',    state: 'green',  vehicles: 197, wait:  31, confidence: 96.4 },
      { id: 'MUM-012', name: 'Lower Parel Signal',         zone: 'South',   state: 'red',    vehicles: 443, wait:  72, confidence: 94.9 },
    ],
    peakHours: [40,25,18,14,28,80,200,420,560,460,340,300,320,340,300,320,420,580,560,480,340,220,130,70],
    weekly: [5200,5450,5380,5510,5990,3850,2100],
    incidents: { labels: ['Accidents','Flooding','Road Work','VIP Movement','Breakdown','Events'], values: [28,42,22,18,14,9] },
    color: '#3b82f6', flag: '🌧️'
  },
  delhi: {
    name: 'Delhi', state: 'NCT of Delhi', code: 'DEL',
    intersections: [
      { id: 'DEL-001', name: 'Connaught Place Inner Circle', zone: 'Central', state: 'red',    vehicles: 720, wait: 115, confidence: 92.4 },
      { id: 'DEL-002', name: 'ITO Junction',                 zone: 'Central', state: 'red',    vehicles: 640, wait: 102, confidence: 94.1 },
      { id: 'DEL-003', name: 'Karol Bagh Signal',            zone: 'West',    state: 'yellow', vehicles: 430, wait:  68, confidence: 90.7 },
      { id: 'DEL-004', name: 'Lajpat Nagar Signal',          zone: 'South',   state: 'red',    vehicles: 510, wait:  84, confidence: 93.5 },
      { id: 'DEL-005', name: 'Nehru Place Junction',         zone: 'South',   state: 'green',  vehicles: 346, wait:  51, confidence: 96.2 },
      { id: 'DEL-006', name: 'Rajouri Garden Signal',        zone: 'West',    state: 'yellow', vehicles: 298, wait:  46, confidence: 91.8 },
      { id: 'DEL-007', name: 'Rohini Sector 3 Jn.',          zone: 'North',   state: 'green',  vehicles: 221, wait:  34, confidence: 95.6 },
      { id: 'DEL-008', name: 'Dwarka Sector 10 Signal',      zone: 'West',    state: 'red',    vehicles: 468, wait:  77, confidence: 92.9 },
      { id: 'DEL-009', name: 'Shahdara Junction',            zone: 'East',    state: 'red',    vehicles: 532, wait:  88, confidence: 90.3 },
      { id: 'DEL-010', name: 'Vasant Kunj Jn.',              zone: 'South',   state: 'green',  vehicles: 189, wait:  29, confidence: 97.4 },
      { id: 'DEL-011', name: 'Pitampura Signal',             zone: 'North',   state: 'yellow', vehicles: 278, wait:  44, confidence: 91.1 },
      { id: 'DEL-012', name: 'Saket District Centre',        zone: 'South',   state: 'green',  vehicles: 214, wait:  33, confidence: 96.8 },
    ],
    peakHours: [30,18,12,10,22,90,220,460,590,480,360,310,330,360,310,350,460,600,580,490,350,230,140,75],
    weekly: [5800,6100,6050,6200,6700,4100,2400],
    incidents: { labels: ['Accidents','Smog/Visibility','VIP/Security','Road Work','Breakdown','Events'], values: [32,28,24,19,12,8] },
    color: '#a855f7', flag: '🏛️'
  },
  bangalore: {
    name: 'Bengaluru', state: 'Karnataka', code: 'BLR',
    intersections: [
      { id: 'BLR-001', name: 'Silk Board Junction',          zone: 'South',  state: 'red',    vehicles: 750, wait: 125, confidence: 91.8 },
      { id: 'BLR-002', name: 'KR Puram Signal',              zone: 'East',   state: 'red',    vehicles: 598, wait:  96, confidence: 93.2 },
      { id: 'BLR-003', name: 'Hebbal Flyover Junction',      zone: 'North',  state: 'yellow', vehicles: 488, wait:  74, confidence: 94.6 },
      { id: 'BLR-004', name: 'Marathahalli Bridge',          zone: 'East',   state: 'red',    vehicles: 632, wait: 101, confidence: 92.4 },
      { id: 'BLR-005', name: 'Koramangala 5th Block',        zone: 'South',  state: 'yellow', vehicles: 362, wait:  57, confidence: 95.9 },
      { id: 'BLR-006', name: 'Yeshwanthpur Junction',        zone: 'North',  state: 'green',  vehicles: 287, wait:  43, confidence: 96.7 },
      { id: 'BLR-007', name: 'Whitefield Main Signal',       zone: 'East',   state: 'red',    vehicles: 518, wait:  83, confidence: 93.1 },
      { id: 'BLR-008', name: 'Electronic City Signal',       zone: 'South',  state: 'red',    vehicles: 576, wait:  92, confidence: 91.5 },
      { id: 'BLR-009', name: 'MG Road Signal',               zone: 'Central',state: 'yellow', vehicles: 428, wait:  66, confidence: 95.3 },
      { id: 'BLR-010', name: 'Jayanagar 4th Block Jn.',      zone: 'South',  state: 'green',  vehicles: 201, wait:  32, confidence: 97.2 },
      { id: 'BLR-011', name: 'Indiranagar 100 Feet Rd',      zone: 'East',   state: 'green',  vehicles: 243, wait:  38, confidence: 96.1 },
      { id: 'BLR-012', name: 'Nagawara Junction',            zone: 'North',  state: 'yellow', vehicles: 312, wait:  49, confidence: 90.8 },
    ],
    peakHours: [28,18,12,9,20,75,180,390,540,450,330,290,310,330,290,330,430,570,550,460,320,210,120,62],
    weekly: [4800,5100,5050,5200,5700,3500,2000],
    incidents: { labels: ['Accidents','Road Work','Breakdown','Waterlogging','IT Events','VIP'], values: [24,38,16,21,12,6] },
    color: '#22c55e', flag: '💻'
  },
  hyderabad: {
    name: 'Hyderabad', state: 'Telangana', code: 'HYD',
    intersections: [
      { id: 'HYD-001', name: 'PVNR Expressway Jn.',          zone: 'Central', state: 'red',    vehicles: 612, wait:  98, confidence: 93.4 },
      { id: 'HYD-002', name: 'Mehdipatnam Signal',           zone: 'West',    state: 'red',    vehicles: 528, wait:  85, confidence: 91.9 },
      { id: 'HYD-003', name: 'Ameerpet Junction',            zone: 'Central', state: 'yellow', vehicles: 446, wait:  71, confidence: 94.7 },
      { id: 'HYD-004', name: 'Gachibowli Signal (IT Hub)',   zone: 'West',    state: 'red',    vehicles: 587, wait:  94, confidence: 95.2 },
      { id: 'HYD-005', name: 'Secunderabad Clock Tower',     zone: 'North',   state: 'yellow', vehicles: 321, wait:  51, confidence: 90.6 },
      { id: 'HYD-006', name: 'HITEC City Junction',          zone: 'West',    state: 'red',    vehicles: 648, wait: 104, confidence: 96.1 },
      { id: 'HYD-007', name: 'Dilsukhnagar Signal',          zone: 'East',    state: 'green',  vehicles: 234, wait:  37, confidence: 95.8 },
      { id: 'HYD-008', name: 'Kukatpally Housing Board',     zone: 'North',   state: 'red',    vehicles: 498, wait:  80, confidence: 92.3 },
      { id: 'HYD-009', name: 'Madhapur Junction',            zone: 'West',    state: 'yellow', vehicles: 376, wait:  60, confidence: 93.7 },
      { id: 'HYD-010', name: 'LB Nagar Junction',            zone: 'East',    state: 'green',  vehicles: 267, wait:  42, confidence: 96.4 },
      { id: 'HYD-011', name: 'Uppal Junction',               zone: 'East',    state: 'yellow', vehicles: 318, wait:  50, confidence: 91.2 },
      { id: 'HYD-012', name: 'Begumpet Signal',              zone: 'Central', state: 'green',  vehicles: 198, wait:  31, confidence: 97.6 },
    ],
    peakHours: [32,20,14,11,24,72,170,360,510,430,320,280,300,320,280,310,400,550,530,450,310,205,118,63],
    weekly: [4500,4750,4700,4850,5250,3300,1950],
    incidents: { labels: ['Accidents','Road Work','IT Event Traffic','Breakdown','VIP','Flooding'], values: [21,29,18,13,10,7] },
    color: '#00f5ff', flag: '🕌'
  },
  kolkata: {
    name: 'Kolkata', state: 'West Bengal', code: 'KOL',
    intersections: [
      { id: 'KOL-001', name: 'Esplanade Crossing',           zone: 'Central', state: 'red',    vehicles: 590, wait:  94, confidence: 92.1 },
      { id: 'KOL-002', name: 'Ultadanga Junction',           zone: 'North',   state: 'red',    vehicles: 498, wait:  80, confidence: 90.8 },
      { id: 'KOL-003', name: 'Park Street Signal',           zone: 'Central', state: 'yellow', vehicles: 388, wait:  62, confidence: 94.3 },
      { id: 'KOL-004', name: 'Gariahat Junction',            zone: 'South',   state: 'red',    vehicles: 542, wait:  87, confidence: 93.5 },
      { id: 'KOL-005', name: 'Dum Dum Junction',             zone: 'North',   state: 'yellow', vehicles: 312, wait:  50, confidence: 91.7 },
      { id: 'KOL-006', name: 'Salt Lake Sector V Signal',    zone: 'East',    state: 'green',  vehicles: 276, wait:  43, confidence: 96.2 },
      { id: 'KOL-007', name: 'New Town Rajarhat Jn.',        zone: 'East',    state: 'green',  vehicles: 231, wait:  36, confidence: 95.8 },
      { id: 'KOL-008', name: 'Howrah Bridge Approach',       zone: 'Central', state: 'red',    vehicles: 618, wait:  99, confidence: 91.4 },
      { id: 'KOL-009', name: 'Jadavpur Junction',            zone: 'South',   state: 'yellow', vehicles: 298, wait:  47, confidence: 93.9 },
      { id: 'KOL-010', name: 'Shyambazar 5-Point',          zone: 'North',   state: 'red',    vehicles: 468, wait:  75, confidence: 90.2 },
      { id: 'KOL-011', name: 'Behala Chowrasta',             zone: 'South',   state: 'green',  vehicles: 212, wait:  34, confidence: 96.7 },
      { id: 'KOL-012', name: 'Kasba Junction',               zone: 'South',   state: 'yellow', vehicles: 321, wait:  51, confidence: 92.6 },
    ],
    peakHours: [28,17,11,9,20,68,155,330,470,400,295,262,280,298,262,285,370,500,480,410,290,190,110,58],
    weekly: [3900,4150,4100,4250,4700,3100,1750],
    incidents: { labels: ['Accidents','Waterlogging','Strike/Bandh','Road Work','Breakdown','Festivals'], values: [18,36,28,15,10,11] },
    color: '#eab308', flag: '🎭'
  }
};

// ===== ACTIVE CITY =====
let currentCityKey = 'chennai';

const DATA = {
  get city() { return CITIES_DATA[currentCityKey]; },
  get intersections() { return CITIES_DATA[currentCityKey].intersections; },

  generateFlowData() {
    const labels = [], actual = [], predicted = [];
    const now = Date.now();
    const peaks = CITIES_DATA[currentCityKey].peakHours;
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 3600000);
      labels.push(t);
      const base = peaks[t.getHours()] + (Math.random() - 0.5) * 60;
      const act = Math.max(10, base);
      predicted.push(Math.round(Math.max(10, act + (Math.random() - 0.5) * 20)));
      actual.push(Math.round(act));
    }
    return { labels, actual, predicted };
  },

  generateLSTMForecast() {
    const labels = [], actual = [], forecast = [], upper = [], lower = [];
    const now = Date.now();
    const peaks = CITIES_DATA[currentCityKey].peakHours;
    for (let i = 72; i >= -24; i--) {
      const t = new Date(now - i * 3600000);
      labels.push(t);
      const base = peaks[t.getHours()];
      const v = Math.max(10, base + (Math.random() - 0.5) * 40);
      if (i >= 0) { actual.push(Math.round(v)); forecast.push(null); upper.push(null); lower.push(null); }
      else {
        actual.push(null);
        const f = Math.max(10, base + (Math.random() - 0.5) * 30);
        forecast.push(Math.round(f)); upper.push(Math.round(f * 1.08)); lower.push(Math.round(f * 0.92));
      }
    }
    return { labels, actual, forecast, upper, lower };
  },

  get peakHours() {
    return { labels: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'], values: CITIES_DATA[currentCityKey].peakHours };
  },
  get weeklyPattern() {
    return { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: CITIES_DATA[currentCityKey].weekly };
  },
  get incidents() { return CITIES_DATA[currentCityKey].incidents; },

  featureImportance: {
    labels: ['Time of Day','Day of Week','Holiday/Festival','Monsoon Season','Prev Flow','Incidents','School Zone','Event Proximity'],
    values: [0.26, 0.21, 0.15, 0.13, 0.12, 0.07, 0.04, 0.02]
  },

  generateLoss() {
    const epochs = [], train = [], val = [];
    for (let i = 1; i <= 100; i++) {
      epochs.push(i);
      train.push(+(2.5 * Math.exp(-0.04 * i) + 0.08 + Math.random() * 0.02).toFixed(4));
      val.push(+(2.8 * Math.exp(-0.038 * i) + 0.12 + Math.random() * 0.03).toFixed(4));
    }
    return { epochs, train, val };
  },

  generateErrorData() {
    return { windows: ['1h','2h','4h','8h','12h','24h'], mae: [5.1,7.4,10.8,15.6,21.2,29.7], rmse: [7.3,10.9,15.1,22.4,29.1,38.8] };
  },

  generateTrend() {
    const days = [], vals = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      days.push(new Date(now - i * 86400000));
      vals.push(Math.round(3500 + Math.random() * 1200 + i * 12));
    }
    return { days, vals };
  },

  get reports() {
    const c = CITIES_DATA[currentCityKey];
    return [
      { icon: '📊', title: `Monthly Report — ${c.name} Apr 2026`, desc: `Signal prediction accuracy across ${c.intersections.length} ${c.name} intersections. Throughput improvement documented across major corridors.`, date: 'Apr 28, 2026', badge: 'new' },
      { icon: '🧠', title: 'LSTM Model Evaluation', desc: `Bi-LSTM + Attention benchmark: 95.8% accuracy on ${c.name} traffic dataset. Festival and monsoon season performance included.`, date: 'Apr 25, 2026', badge: 'ready' },
      { icon: '🚦', title: `Intersection Audit — ${c.name}`, desc: `Per-intersection audit for all ${c.intersections.length} junctions with signal timing recommendations.`, date: 'Apr 22, 2026', badge: 'ready' },
      { icon: '⚡', title: 'Real-Time System Status', desc: `Operational status of all monitored ${c.name} intersections. Uptime: 99.2%.`, date: 'Apr 28, 2026', badge: 'new' },
      { icon: '🌧️', title: 'Monsoon Traffic Impact Study', desc: `Monsoon impact on ${c.name} signal timing and vehicle flow. Waterlogging hotspots documented.`, date: 'Apr 20, 2026', badge: 'ready' },
      { icon: '🎉', title: 'Festival Season Traffic Report', desc: `Festival traffic surge patterns and congestion analysis for ${c.name} key junctions.`, date: 'Apr 18, 2026', badge: 'ready' },
    ];
  },

  modelLayers: [
    { icon: '📥', name: 'Input Layer',     desc: 'Multi-variate time series: 13 features × 24h lookback', params: '312 units', color: '#00f5ff' },
    { icon: '🔄', name: 'Bi-LSTM Layer 1', desc: 'Bidirectional LSTM capturing morning & evening peaks',   params: '256 units', color: '#a855f7' },
    { icon: '🔄', name: 'LSTM Layer 2',    desc: 'Stacked LSTM with recurrent dropout (0.2)',               params: '128 units', color: '#a855f7' },
    { icon: '🎯', name: 'Attention Layer', desc: 'Multi-head temporal attention — event spike detection',   params: '64 units',  color: '#f97316' },
    { icon: '🔗', name: 'Dense Layer',     desc: 'Fully connected with ReLU — zone-specific fusion',        params: '64 units',  color: '#22c55e' },
    { icon: '📤', name: 'Output Layer',    desc: 'Softmax → Green / Yellow / Red probability',              params: '3 units',   color: '#22c55e' },
  ],

  modelMetrics: [
    { name: 'Overall Accuracy',    val: '95.8%',     cls: 'green'  },
    { name: 'F1-Score (Macro)',     val: '0.947',     cls: 'cyan'   },
    { name: 'Mean Absolute Error',  val: '5.1 veh/h', cls: 'purple' },
    { name: 'RMSE',                 val: '7.3 veh/h', cls: 'orange' },
    { name: 'ROC-AUC',             val: '0.988',     cls: 'green'  },
    { name: 'Inference Latency',    val: '14ms',      cls: 'cyan'   },
    { name: 'Training Epochs',      val: '100',       cls: 'purple' },
    { name: 'Total Parameters',     val: '1.31M',     cls: 'orange' },
  ]
};
