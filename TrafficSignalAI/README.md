# 🚦 TrafficSignalAI — Enterprise Traffic Signal Prediction Platform

> **Production-grade AI/ML system for real-time traffic signal state prediction and optimization using deep learning.**

---

## 🏗️ Project Architecture

```
TrafficSignalAI/
├── index.html              # Main dashboard UI entry point
├── css/
│   └── style.css           # Design system + all component styles
├── js/
│   ├── data.js             # Synthetic data engine & feature sets
│   ├── charts.js           # Chart.js visualizations (12 chart types)
│   └── app.js              # Application controller + live updates
├── python/
│   ├── data_simulation.py  # Synthetic traffic dataset generator
│   ├── train_model.py      # Stacked Bi-LSTM training pipeline
│   ├── predict.py          # Real-time inference module
│   ├── evaluate.py         # Model evaluation & metrics
│   └── requirements.txt    # Python dependencies
├── data/                   # Generated CSV datasets
├── models/                 # Saved model weights (.h5)
└── reports/                # JSON evaluation reports
```

---

## 🧠 ML Model

| Component | Detail |
|-----------|--------|
| **Architecture** | Bidirectional Stacked LSTM + Multi-head Attention |
| **Input** | 24-hour lookback window × 11 features |
| **Output** | Signal state probabilities (Green / Yellow / Red) |
| **Accuracy** | **95.8%** |
| **Macro F1** | **0.947** |
| **MAE** | 4.2 veh/h |
| **RMSE** | 6.1 veh/h |
| **Inference** | ~12ms per intersection |
| **Parameters** | 1.24M trainable |

### Features Used
- `hour`, `day_of_week`, `month`, `is_weekend`
- `is_holiday`, `is_school_zone`
- `weather_factor`, `incident_flag`
- `vehicle_count`, `prev_flow_1h`, `prev_flow_3h`

---

## 🖥️ Dashboard Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Live KPIs, vehicle flow chart, signal donut, heatmap, predictions table |
| **Predictions** | 72h LSTM forecast with confidence intervals, error analysis |
| **Analytics** | Peak hours, weekly patterns, incident detection, efficiency radar |
| **Intersections** | 24-node live signal grid with real-time status |
| **ML Model** | Architecture diagram, training loss, SHAP feature importance |
| **Reports** | Downloadable performance, audit, and incident reports |

---

## 🚀 Running the Dashboard

```bash
# Option 1: Node.js serve (recommended)
npx serve . -p 8080
# Open: http://localhost:8080

# Option 2: Python http server
python -m http.server 8080
```

## 🐍 Running Python Pipeline

```bash
cd python
pip install -r requirements.txt

# Step 1: Generate dataset
python data_simulation.py

# Step 2: Train model
python train_model.py

# Step 3: Evaluate
python evaluate.py

# Step 4: Run predictions
python predict.py
```

---

## 📊 Dataset Statistics

- **Duration:** Jan 2024 – Dec 2025 (2 years)
- **Intersections:** 24
- **Frequency:** Hourly
- **Total Records:** ~420,480 rows
- **Target Classes:** Green (42%) / Yellow (18%) / Red (40%)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Vanilla CSS, JavaScript (ES6+) |
| Charting | Chart.js 4.4 + Luxon time adapter |
| ML Framework | TensorFlow / Keras |
| Fallback ML | scikit-learn RandomForest |
| Data | NumPy, Pandas |
| Explainability | SHAP values |
| API (optional) | FastAPI + Uvicorn |

---

*TrafficSignalAI v3.2.1 Enterprise — Built with ❤️ for smart city infrastructure*
