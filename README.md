# PowerPredict

AI-powered full-stack web application for forecasting electricity consumption (sector-wise) and solar power generation using a hybrid ANN + LSTM inference pipeline.

## Live Demo

- Frontend: https://electricity-prediction.vercel.app/
- Backend API: https://electricity-prediction-4.onrender.com/

## What This Project Does

- Forecasts daily values for:
	- consumption_Staff_quarters
	- consumption_Academic_blocks
	- consumption_Hostels
	- consumption_Chiller plant
	- consumption_STP
	- power_generation_by_solar_panels
- Supports short- and medium-range forecasts (1, 3, and 6 months from UI; capped to 180 days in backend).
- Visualizes predictions in an interactive dashboard with:
	- solar generation trend (area chart)
	- sector-wise consumption share (pie chart)
	- sector consumption trends over time (multi-line chart)
	- total sector comparison (bar chart)
	- summary KPIs (total generation, total consumption, efficiency rate)

## Architecture

### Backend (FastAPI)

- File: backend/main.py
- Loads resources on startup:
	- ann_model.keras
	- lstm_model.keras
	- scaler.pkl
	- Final.xlsx
- Uses fixed `n_steps = 30` time window from training.
- Creates ANN and LSTM inputs from the latest/history window, then combines outputs as:

	hybrid_prediction = (ann_prediction + lstm_prediction) / 2

- Applies inverse scaling before returning final values.

### Frontend (React + Vite)

- Main UI: frontend/src/components/SolarDashboard.jsx
- Fetches `/forecast` from deployed backend when user changes period.
- Transforms API payload into chart-friendly structures using `useMemo`.
- Renders responsive charts using Recharts and styled with Tailwind CSS.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS v4, Recharts, Lucide React
- Backend: FastAPI, Uvicorn, Pydantic
- ML/Data: TensorFlow/Keras, pandas, numpy, scikit-learn, joblib, openpyxl
- Deployment: Vercel (frontend), Render (backend)

## Project Structure

```text
powerpredict/
	backend/
		main.py
		ann_model.keras
		lstm_model.keras
		scaler.pkl
		Final.xlsx
		requirements.txt
		render.yaml
		start.sh
	frontend/
		src/
			components/
				SolarDashboard.jsx
				SummaryCard.jsx
				charts/
			main.jsx
			App.jsx
			index.css
		package.json
		vite.config.js
```

## API Reference

Base URL (production): https://electricity-prediction-4.onrender.com

### GET /

Health welcome message.

Response example:

```json
{ "message": "PowerPredict API is running." }
```

### GET /health

Basic health endpoint.

Response example:

```json
{ "status": "ok" }
```

### POST /predict

Predicts one day using the history window ending at the provided date.

Request body:

```json
{ "date": "2025-01-15" }
```

Response shape:

```json
{
	"date": "2025-01-15",
	"prediction": {
		"consumption_Staff_quarters": 0,
		"consumption_Academic_blocks": 0,
		"consumption_Hostels": 0,
		"consumption_Chiller plant": 0,
		"consumption_STP": 0,
		"power_generation_by_solar_panels": 0
	}
}
```

### POST /forecast

Forecasts upcoming days from the latest available data.

Request body:

```json
{ "months": 3 }
```

Response shape:

```json
{
	"forecast": [
		{
			"date": "2026-01-01",
			"prediction": {
				"consumption_Staff_quarters": 0,
				"consumption_Academic_blocks": 0,
				"consumption_Hostels": 0,
				"consumption_Chiller plant": 0,
				"consumption_STP": 0,
				"power_generation_by_solar_panels": 0
			}
		}
	]
}
```

## Local Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1) Backend setup

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Notes and Constraints

- Backend currently enables permissive CORS (`allow_origins=["*"]`) for easier integration.
- The model pipeline expects `Final.xlsx` and `scaler.pkl` to be present in backend directory.
- Forecast horizon is capped internally for safety (`months * 30`, max 180 days).
- Frontend currently calls the deployed backend URL directly from SolarDashboard.

## Deployment

- Backend deployment configuration: backend/render.yaml
- Backend startup command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Frontend is deployed separately on Vercel.

## Author

- Madhumithra
- Repository: https://github.com/mithra0612/electricity-prediction/
