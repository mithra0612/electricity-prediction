
import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown.jsx';
import ForecastChart from './components/ForecastChart.jsx';
import Header from './components/Header.jsx';
import StatsCards from './components/StatsCards.jsx';
import ForecastService from './services/ForecastService.js';
const App = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const periodOptions = [
    { value: 30, label: 'Next 1 Month (30 days)' },
    { value: 90, label: 'Next 3 Months (90 days)' },
    { value: 180, label: 'Next 6 Months (180 days)' }
  ];

  const fetchForecastData = async (days) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ForecastService.getForecast(days);
      setForecastData(data);
    } catch (err) {
      setError('Failed to load forecast data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="max-w-xs">
            <Dropdown
              value={selectedPeriod}
              onChange={handlePeriodChange}
              options={periodOptions}
              label="Forecast Period"
            />
          </div>
        </div>
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <StatsCards data={forecastData} />
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Forecast Comparison ({selectedPeriod} days)
          </h2>
          <ForecastChart data={forecastData} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default App;
