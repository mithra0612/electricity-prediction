import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Zap, TrendingUp } from 'lucide-react';
import SummaryCard from './SummaryCard';
import SolarGenerationChart from './charts/SolarGenerationChart';
import ConsumptionPieChart from './charts/ConsumptionPieChart';
import ConsumptionTrendsChart from './charts/ConsumptionTrendsChart';
import SectorComparisonChart from './charts/SectorComparisonChart';

const SolarDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [highlightedSector, setHighlightedSector] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch backend forecast data when selectedPeriod changes
  useEffect(() => {
    setLoading(true);
    console.log('[SolarDashboard] API /forecast POST with months:', selectedPeriod);
    fetch(`https://electricity-prediction-1hra.onrender.com/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ months: parseInt(selectedPeriod) })
    })
      .then(res => {
        console.log('[SolarDashboard] API /forecast status:', res.status, res.statusText);
        return res.json();
      })
      .then(data => {
        console.log('[SolarDashboard] API /forecast response:', data);
        setForecastData(data.forecast || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[SolarDashboard] API /forecast error:', err);
        setLoading(false);
      });
  }, [selectedPeriod]);

  // Prepare chart data from backend response
  const solarData = useMemo(() => {
    return forecastData.map(day => ({
      date: day.date,
      generation: day.prediction.power_generation_by_solar_panels
    }));
  }, [forecastData]);

  const consumptionData = useMemo(() => {
    return forecastData.map(day => ({
      date: day.date,
      'Staff Quarters': day.prediction?.consumption_Staff_quarters ?? 0,
      'Academic Blocks': day.prediction?.consumption_Academic_blocks ?? 0,
      'Hostels': day.prediction?.consumption_Hostels ?? 0,
      'Chiller Plants': day.prediction?.["consumption_Chiller plant"] ?? 0,
      'STP': day.prediction?.consumption_STP ?? 0
    }));
  }, [forecastData]);

  const pieData = useMemo(() => {
    const sectors = ['Staff Quarters', 'Academic Blocks', 'Hostels', 'Chiller Plants', 'STP'];
    const totals = sectors.reduce((acc, sector) => {
      acc[sector] = consumptionData.reduce((sum, day) => sum + (day[sector] || 0), 0);
      return acc;
    }, {});
    const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return sectors.map(sector => ({
      name: sector,
      value: totals[sector],
      percentage: grandTotal ? ((totals[sector] / grandTotal) * 100).toFixed(1) : 0
    }));
  }, [consumptionData]);

  const barData = useMemo(() => {
    const sectors = ['Staff Quarters', 'Academic Blocks', 'Hostels', 'Chiller Plants', 'STP'];
    return sectors.map(sector => ({
      sector: sector.replace(' ', '\n'),
      consumption: consumptionData.reduce((sum, day) => sum + (day[sector] || 0), 0)
    }));
  }, [consumptionData]);

  const totalGeneration = solarData.reduce((sum, day) => sum + (day.generation || 0), 0);
  const totalConsumption = barData.reduce((sum, sector) => sum + (sector.consumption || 0), 0);
  const efficiencyRate = totalConsumption ? ((totalGeneration / totalConsumption) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Solar Power Prediction & Consumption Dashboard
              </h1>
              <p className="text-gray-600">Real-time monitoring and forecasting</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700 text-center">Time Period</label>
              <div className="relative bg-gray-100 p-1 rounded-lg shadow-inner">
                <div className="flex">
                  {/*
                    Replaced the dropdown with a custom segmented control
                    Using button-style tabs with smooth transitions and hover effects
                    Added visual indicators for the active selection
                  */}
                  {/*
                    Time period options for the segmented control
                  */}
                  { [
                    { value: '1', label: '1 Month' },
                    { value: '3', label: '3 Months' },
                    { value: '6', label: '6 Months' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedPeriod(option.value)}
                      className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 transform ${
                        selectedPeriod === option.value
                          ? 'bg-blue-500 text-white shadow-md scale-105 z-10'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  )) }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard
            title="Total Generation"
            value={loading ? '...' : totalGeneration.toLocaleString()}
            unit="kWh"
            gradient=""
            bgColor=""
            icon={<Sun className="w-8 h-8" />}
          />

          <SummaryCard
            title="Total Consumption"
            value={loading ? '...' : totalConsumption.toLocaleString()}
            unit="kWh"
            gradient=""
            bgColor=""
            icon={<Zap className="w-8 h-8" />}
          />

          <SummaryCard
            title="Efficiency Rate"
            value={loading ? '...' : efficiencyRate}
            unit="%"
            gradient=""
            bgColor=""
            icon={<TrendingUp className="w-8 h-8" />}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 mb-6">
          <SolarGenerationChart data={solarData} />
          <ConsumptionPieChart data={pieData} />
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ConsumptionTrendsChart 
            data={consumptionData} 
            highlightedSector={highlightedSector}
            setHighlightedSector={setHighlightedSector}
          />
          <SectorComparisonChart data={barData} />
        </div>
      </div>
    </div>
  );
};

export default SolarDashboard;
