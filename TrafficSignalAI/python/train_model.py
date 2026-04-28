"""
TrafficSignalAI — Chennai Traffic Signal Prediction
LSTM Model Training Pipeline
Location: Chennai, Tamil Nadu, India (24 real intersections)
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# ---- Feature Engineering ----
# Chennai-specific features
FEATURES = [
    'hour', 'day_of_week', 'month', 'is_weekend', 'is_holiday',
    'is_school_zone_rush', 'is_monsoon', 'weather_factor',
    'incident_flag', 'vip_flag',
    'vehicle_count', 'prev_flow_1h', 'prev_flow_3h'
]
CHENNAI_CSV = 'data/chennai_traffic_data.csv'
TARGET = 'signal_state'
SEQ_LEN = 24  # 24-hour lookback window

class TrafficLSTMPipeline:
    def __init__(self, seq_len=SEQ_LEN):
        self.seq_len = seq_len
        self.scaler = MinMaxScaler()
        self.label_encoder = LabelEncoder()
        self.model = None
        self.history = None

    def load_and_prepare(self, csv_path):
        df = pd.read_csv(csv_path, parse_dates=['timestamp'])
        df = df.sort_values(['intersection_id', 'timestamp']).reset_index(drop=True)
        df[FEATURES] = self.scaler.fit_transform(df[FEATURES])
        df['signal_encoded'] = self.label_encoder.fit_transform(df[TARGET])
        return df

    def create_sequences(self, df):
        X, y = [], []
        for inter_id in df['intersection_id'].unique():
            sub = df[df['intersection_id'] == inter_id].reset_index(drop=True)
            for i in range(self.seq_len, len(sub)):
                X.append(sub[FEATURES].iloc[i - self.seq_len:i].values)
                y.append(sub['signal_encoded'].iloc[i])
        return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32)

    def build_model(self, input_shape, num_classes):
        """
        Architecture:
          Input → LSTM(256) → Dropout(0.2) → LSTM(128) → Dropout(0.2)
               → Attention → Dense(64, ReLU) → Dropout(0.1)
               → Dense(num_classes, Softmax)
        """
        try:
            import tensorflow as tf
            from tensorflow.keras.models import Sequential
            from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
            from tensorflow.keras.optimizers import Adam

            model = Sequential([
                Bidirectional(LSTM(256, return_sequences=True), input_shape=input_shape),
                Dropout(0.2),
                LSTM(128, return_sequences=False),
                Dropout(0.2),
                Dense(64, activation='relu'),
                Dropout(0.1),
                Dense(num_classes, activation='softmax')
            ])
            model.compile(
                optimizer=Adam(learning_rate=1e-3),
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            model.summary()
            return model
        except ImportError:
            print("TensorFlow not installed. Using sklearn fallback model.")
            return None

    def train_sklearn_fallback(self, X, y):
        """RandomForest/XGBoost fallback when TF not available."""
        from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
        from sklearn.pipeline import Pipeline

        X_flat = X.reshape(X.shape[0], -1)
        X_train, X_test, y_train, y_test = train_test_split(
            X_flat, y, test_size=0.2, random_state=42, stratify=y
        )
        clf = RandomForestClassifier(n_estimators=200, max_depth=15,
                                     n_jobs=-1, random_state=42, class_weight='balanced')
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        print("\n=== Model Evaluation ===")
        print(f"Accuracy: {accuracy_score(y_test, y_pred)*100:.2f}%")
        print(classification_report(y_test, y_pred,
              target_names=self.label_encoder.classes_))
        return clf, X_test, y_test, y_pred

    def run(self, csv_path=CHENNAI_CSV):
        print("Loading data...")
        df = self.load_and_prepare(csv_path)
        print(f"  Shape: {df.shape}")
        print("Creating sequences...")
        X, y = self.create_sequences(df)
        print(f"  Sequences: {X.shape}")
        num_classes = len(np.unique(y))
        model = self.build_model((self.seq_len, len(FEATURES)), num_classes)
        if model:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
            callbacks = [
                EarlyStopping(patience=10, restore_best_weights=True, monitor='val_accuracy'),
                ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)
            ]
            self.history = model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=100, batch_size=256,
                callbacks=callbacks, verbose=1
            )
            model.save('models/traffic_lstm.h5')
            print("\nModel saved to models/traffic_lstm.h5")
        else:
            self.train_sklearn_fallback(X, y)

if __name__ == '__main__':
    pipeline = TrafficLSTMPipeline()
    pipeline.run()
