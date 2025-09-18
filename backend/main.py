from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from keras.models import load_model
from keras.initializers import Orthogonal

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
ann_model = None
lstm_model = None
scaler = None
df = None
n_steps = 30  # Fixed from training
features = [
    "consumption_Staff_quarters",
    "consumption_Academic_blocks",
    "consumption_Hostels",
    "consumption_Chiller plant",
    "consumption_STP",
    "power_generation_by_solar_panels"
]

@app.on_event("startup")
def load_models():
    global ann_model, lstm_model, scaler, df, n_steps, features
    try:
        ann_model = load_model("ann_model.keras")
        print("ANN model loaded.")
    except Exception as e:
        print(f"ANN model not loaded: {e}")

    try:
        lstm_model = load_model("lstm_model.keras", custom_objects={"Orthogonal": Orthogonal})
        print("LSTM model loaded.")
    except Exception as e:
        print(f"LSTM model not loaded: {e}")

    try:
        scaler = joblib.load("scaler.pkl")
        print("Scaler loaded (hardcoded n_steps and features).")
    except Exception as e:
        print(f"Scaler not loaded: {e}")

    try:
        df = pd.read_excel("Final.xlsx")
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])
        df = df.sort_values("date").reset_index(drop=True)
        df.columns = df.columns.str.strip()

        # ✅ Validate required columns
        missing_cols = [col for col in features if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing columns in Final.xlsx: {missing_cols}")

        print("Dataset loaded.")
        print("Columns in dataset:", df.columns.tolist())
    except Exception as e:
        print(f"Dataset not loaded: {e}")

# Input schema
class PredictRequest(BaseModel):
    date: str  # Accept date as string in 'YYYY-MM-DD' format

class ForecastRequest(BaseModel):
    months: int  # Number of months to forecast

def get_window_ending_at(date_str):
    global df, scaler, n_steps, features
    query_date = pd.to_datetime(date_str)
    idx = df.index[df["date"] == query_date]
    if len(idx) == 0 or idx[0] < n_steps:
        return None
    window_df = df.iloc[idx[0]-n_steps:idx[0]][features]
    if window_df.shape[0] != n_steps:
        return None
    window_scaled = scaler.transform(window_df.values)
    return window_scaled

def run_prediction(date: str):
    global ann_model, lstm_model, scaler, df, n_steps, features
    if not ann_model or not lstm_model or not scaler or df is None:
        raise HTTPException(status_code=500, detail="Models, scaler, or dataset not loaded.")

    window_scaled = get_window_ending_at(date)
    if window_scaled is None:
        raise HTTPException(status_code=404, detail="Not enough data before this date for prediction.")

    X_ann = window_scaled.flatten().reshape(1, -1)
    X_lstm = window_scaled.reshape(1, n_steps, len(features))

    ann_pred = ann_model.predict(X_ann, verbose=0)
    lstm_pred = lstm_model.predict(X_lstm, verbose=0)
    hybrid_pred = (ann_pred.flatten() + lstm_pred.flatten()) / 2
    hybrid_pred = scaler.inverse_transform(hybrid_pred.reshape(1, -1)).flatten()

    return {
        "date": date,
        "prediction": {f: float(v) for f, v in zip(features, hybrid_pred)}
    }

def run_forecast(months: int):
    global ann_model, lstm_model, scaler, df, n_steps, features
    if not ann_model or not lstm_model or not scaler or df is None:
        raise HTTPException(status_code=500, detail="Models, scaler, or dataset not loaded.")

    forecast_days = min(months * 30, 180)
    last_window_df = df[features].iloc[-n_steps:]
    if last_window_df.shape[0] != n_steps:
        raise HTTPException(status_code=500, detail="Not enough data for forecasting.")

    window_scaled = scaler.transform(last_window_df.values)
    current_ann = window_scaled.flatten()
    current_lstm = window_scaled.copy()

    # Prepare input windows for batch prediction
    ann_inputs = []
    lstm_inputs = []
    for i in range(forecast_days):
        ann_inputs.append(current_ann.copy())
        lstm_inputs.append(current_lstm.copy())
        # Update sliding windows for next day
        ann_pred = ann_model.predict(current_ann.reshape(1, -1), verbose=0)
        lstm_pred = lstm_model.predict(current_lstm.reshape(1, n_steps, len(features)), verbose=0)
        current_ann = np.concatenate([current_ann[len(features):], ann_pred.flatten()])
        current_lstm = np.vstack([current_lstm[1:], lstm_pred])

    ann_inputs = np.array(ann_inputs)
    lstm_inputs = np.array(lstm_inputs)

    # Batch prediction
    ann_preds = ann_model.predict(ann_inputs, verbose=0)
    lstm_preds = lstm_model.predict(lstm_inputs, verbose=0)
    hybrid_preds = (ann_preds + lstm_preds) / 2
    hybrid_preds_inv = scaler.inverse_transform(hybrid_preds)

    results = []
    last_date = df["date"].iloc[-1]
    for i in range(forecast_days):
        forecast_date = last_date + pd.Timedelta(days=i+1)
        results.append({
            "date": forecast_date.strftime("%Y-%m-%d"),
            "prediction": {f: float(v) for f, v in zip(features, hybrid_preds_inv[i])}
        })

    return {"forecast": results}

@app.post("/predict")
def predict(request: PredictRequest):
    return run_prediction(request.date)

@app.post("/forecast")
def forecast(request: ForecastRequest):
    result = run_forecast(request.months)
    return result

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "Electricity Prediction API is running."}

# To further speed up, consider batching predictions:
# Instead of calling ann_model.predict and lstm_model.predict inside the loop,
# prepare all input windows and call .predict() once for all, then process results.
