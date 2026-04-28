"""
TrafficSignalAI — Chennai, Tamil Nadu, India
Data Simulation & Feature Engineering
Generates realistic synthetic traffic dataset for 24 real Chennai intersections.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

random.seed(42)
np.random.seed(42)

# ===== REAL CHENNAI INTERSECTIONS WITH GPS COORDINATES =====
INTERSECTIONS = [
    {'id': 'CHN-001', 'name': 'Koyambedu Junction',           'zone': 'West Chennai',      'lat': 13.0694, 'lng': 80.1948},
    {'id': 'CHN-002', 'name': 'Vadapalani Signal',             'zone': 'West Chennai',      'lat': 13.0524, 'lng': 80.2121},
    {'id': 'CHN-003', 'name': 'Anna Nagar Tower Park',         'zone': 'North Chennai',     'lat': 13.0850, 'lng': 80.2101},
    {'id': 'CHN-004', 'name': 'Guindy Signal (GST Road)',      'zone': 'South Chennai',     'lat': 13.0067, 'lng': 80.2206},
    {'id': 'CHN-005', 'name': 'T. Nagar Pondy Bazaar',         'zone': 'Central Chennai',   'lat': 13.0418, 'lng': 80.2341},
    {'id': 'CHN-006', 'name': 'Adyar Signal',                  'zone': 'South Chennai',     'lat': 13.0012, 'lng': 80.2565},
    {'id': 'CHN-007', 'name': 'Tambaram Junction',             'zone': 'South Chennai',     'lat': 12.9249, 'lng': 80.1000},
    {'id': 'CHN-008', 'name': 'Sholinganallur Junction',       'zone': 'IT Corridor (OMR)', 'lat': 12.9010, 'lng': 80.2279},
    {'id': 'CHN-009', 'name': 'Porur Junction',                'zone': 'West Chennai',      'lat': 13.0358, 'lng': 80.1572},
    {'id': 'CHN-010', 'name': 'Perambur Signal',               'zone': 'North Chennai',     'lat': 13.1141, 'lng': 80.2329},
    {'id': 'CHN-011', 'name': 'Velachery Main Road Jn.',       'zone': 'South Chennai',     'lat': 12.9815, 'lng': 80.2209},
    {'id': 'CHN-012', 'name': 'Madhya Kailash Jn. (OMR)',     'zone': 'IT Corridor (OMR)', 'lat': 12.9716, 'lng': 80.2455},
    {'id': 'CHN-013', 'name': 'Poonamallee High Road Jn.',     'zone': 'West Chennai',      'lat': 13.0490, 'lng': 80.1665},
    {'id': 'CHN-014', 'name': 'Saidapet Signal',               'zone': 'Central Chennai',   'lat': 13.0213, 'lng': 80.2226},
    {'id': 'CHN-015', 'name': 'Egmore Signal',                 'zone': 'Central Chennai',   'lat': 13.0732, 'lng': 80.2609},
    {'id': 'CHN-016', 'name': 'Royapettah Signal',             'zone': 'Central Chennai',   'lat': 13.0524, 'lng': 80.2601},
    {'id': 'CHN-017', 'name': 'Ambattur Industrial Estate Jn.','zone': 'North Chennai',     'lat': 13.1143, 'lng': 80.1548},
    {'id': 'CHN-018', 'name': 'Chromepet Signal',              'zone': 'South Chennai',     'lat': 12.9516, 'lng': 80.1462},
    {'id': 'CHN-019', 'name': 'Broadway Signal (MTC Hub)',     'zone': 'Central Chennai',   'lat': 13.0878, 'lng': 80.2785},
    {'id': 'CHN-020', 'name': 'Tidel Park Signal (OMR)',       'zone': 'IT Corridor (OMR)', 'lat': 12.9895, 'lng': 80.2415},
    {'id': 'CHN-021', 'name': 'Mogappair West Signal',         'zone': 'North Chennai',     'lat': 13.0840, 'lng': 80.1760},
    {'id': 'CHN-022', 'name': 'Kolathur Signal',               'zone': 'North Chennai',     'lat': 13.1256, 'lng': 80.2141},
    {'id': 'CHN-023', 'name': 'Pallavaram Junction',           'zone': 'South Chennai',     'lat': 12.9675, 'lng': 80.1491},
    {'id': 'CHN-024', 'name': 'Perungudi OMR Junction',        'zone': 'IT Corridor (OMR)', 'lat': 12.9620, 'lng': 80.2394},
]

# Zone multipliers — OMR IT corridor and Central are heaviest
ZONE_MULTIPLIERS = {
    'Central Chennai':   1.25,
    'IT Corridor (OMR)': 1.30,
    'South Chennai':     1.10,
    'West Chennai':      1.05,
    'North Chennai':     0.95,
}

START_DATE = datetime(2024, 1, 1, 0, 0, 0)
END_DATE   = datetime(2025, 12, 31, 23, 0, 0)

# Tamil Nadu public holidays (approximate)
TN_HOLIDAYS = {
    (1, 1):   'New Year',
    (1, 14):  'Pongal',
    (1, 15):  'Pongal Day 2',
    (1, 16):  'Thiruvalluvar Day',
    (1, 17):  'Uzhavar Thirunal',
    (4, 14):  'Tamil New Year',
    (8, 15):  'Independence Day',
    (10, 2):  'Gandhi Jayanthi',
    (11, 1):  'Diwali',   # approximate
    (12, 25): 'Christmas',
}

# School zones — special rush at school hours
SCHOOL_ZONE_IDS = ['CHN-003', 'CHN-021', 'CHN-022', 'CHN-010']

def is_holiday(dt):
    key = (dt.month, dt.day)
    return 1 if key in TN_HOLIDAYS else 0

def is_school_zone_rush(inter_id, hour, weekday, dt):
    if inter_id not in SCHOOL_ZONE_IDS:
        return 0
    if weekday >= 5 or is_holiday(dt):
        return 0
    return 1 if (7 <= hour <= 9 or 13 <= hour <= 14) else 0

def is_monsoon(month):
    """Northeast monsoon: Oct–Dec; Southwest monsoon: Jun–Sep"""
    return 1 if month in [6, 7, 8, 9, 10, 11, 12] else 0

def monsoon_factor(month):
    heavy_months = {10: 0.80, 11: 0.72, 12: 0.78}
    mild_months  = {6: 0.90, 7: 0.88, 8: 0.87, 9: 0.89}
    return heavy_months.get(month, mild_months.get(month, 1.0))

def base_flow_chennai(hour, weekday, zone, dt):
    """Realistic Chennai IST traffic profile."""
    weekend_factor = 0.60 if weekday >= 5 else 1.0
    holiday_factor = 0.45 if is_holiday(dt) else 1.0
    zone_mult = ZONE_MULTIPLIERS.get(zone, 1.0)

    if 8 <= hour <= 10:       base = np.random.normal(460, 50)   # Morning peak
    elif 17 <= hour <= 20:    base = np.random.normal(510, 55)   # Evening peak
    elif 13 <= hour <= 14:    base = np.random.normal(290, 35)   # Lunch
    elif 0 <= hour <= 5:      base = np.random.normal(35, 10)    # Night
    elif 6 <= hour <= 7:      base = np.random.normal(200, 30)   # Pre-peak
    else:                     base = np.random.normal(210, 30)   # Off-peak

    flow = base * weekend_factor * holiday_factor * zone_mult * monsoon_factor(dt.month)
    return max(5.0, flow)

def generate_signal_state(flow):
    """Classify signal state based on flow intensity."""
    if flow > 430:    probs = [0.10, 0.18, 0.72]   # Heavily congested → red
    elif flow > 260:  probs = [0.40, 0.28, 0.32]   # Moderate
    else:             probs = [0.68, 0.16, 0.16]   # Light → green
    return np.random.choice(['green', 'yellow', 'red'], p=probs)

def generate_dataset():
    records = []
    ts = START_DATE
    total_hours = int((END_DATE - START_DATE).total_seconds() / 3600)
    print(f"Generating {total_hours:,} hours × {len(INTERSECTIONS)} intersections "
          f"= {total_hours * len(INTERSECTIONS):,} records ...")

    while ts <= END_DATE:
        for inter in INTERSECTIONS:
            flow = base_flow_chennai(ts.hour, ts.weekday(), inter['zone'], ts)

            weather_factor = monsoon_factor(ts.month)
            incident = int(np.random.random() < 0.04)   # ~4% incident rate in Chennai
            holiday  = is_holiday(ts)
            school   = is_school_zone_rush(inter['id'], ts.hour, ts.weekday(), ts)
            monsoon  = is_monsoon(ts.month)

            # VIP movement (sporadic)
            vip_flag = int(np.random.random() < 0.005)
            if vip_flag:
                flow *= 0.50   # VIP convoy causes partial blockage

            flow_adj  = max(5.0, flow * (0.65 if incident else 1.0))
            wait_time = max(8, min(150, flow_adj / 5.5 + np.random.normal(0, 4)))
            state     = generate_signal_state(flow_adj)

            records.append({
                'timestamp':          ts.isoformat(),
                'intersection_id':    inter['id'],
                'intersection_name':  inter['name'],
                'zone':               inter['zone'],
                'latitude':           inter['lat'],
                'longitude':          inter['lng'],
                'hour':               ts.hour,
                'day_of_week':        ts.weekday(),
                'month':              ts.month,
                'is_weekend':         int(ts.weekday() >= 5),
                'is_holiday':         holiday,
                'is_school_zone_rush':school,
                'is_monsoon':         monsoon,
                'weather_factor':     round(weather_factor, 3),
                'incident_flag':      incident,
                'vip_flag':           vip_flag,
                'vehicle_count':      round(flow_adj, 1),
                'wait_time_sec':      round(wait_time, 1),
                'signal_state':       state,
                'prev_flow_1h':       round(max(5, flow_adj * np.random.uniform(0.82, 1.18)), 1),
                'prev_flow_3h':       round(max(5, flow_adj * np.random.uniform(0.75, 1.25)), 1),
            })
        ts += timedelta(hours=1)

    df = pd.DataFrame(records)
    return df

if __name__ == '__main__':
    import os
    os.makedirs('data', exist_ok=True)
    df = generate_dataset()
    out_path = 'data/chennai_traffic_data.csv'
    df.to_csv(out_path, index=False)
    print(f"\n✅ Dataset saved: {out_path}")
    print(f"   Shape     : {df.shape[0]:,} rows × {df.shape[1]} columns")
    print(f"   Intersections: {df['intersection_id'].nunique()} Chennai junctions")
    print(f"   Date Range: {df['timestamp'].min()} → {df['timestamp'].max()}")
    print(f"\n   Signal State Distribution:")
    print(df['signal_state'].value_counts(normalize=True).map(lambda x: f"{x*100:.1f}%"))
    print(f"\n   Zone-wise Vehicle Count (mean):")
    print(df.groupby('zone')['vehicle_count'].mean().round(1))
