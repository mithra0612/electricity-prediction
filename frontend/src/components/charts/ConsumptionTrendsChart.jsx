import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../../common/CustomTooltip';

// Blue shades palette
const BLUE_SHADES = {
  0: '#1e40af', // blue-800
  1: '#2563eb', // blue-600
  2: '#3b82f6', // blue-500
  3: '#60a5fa', // blue-400
  4: '#93c5fd', // blue-300
  5: '#bfdbfe', // blue-200
};

const ConsumptionTrendsChart = ({ data, highlightedSector, setHighlightedSector }) => {
  console.log('[ConsumptionTrendsChart] data:', data);

  const sectorKeys = [
    'Staff Quarters',
    'Academic Blocks',
    'Hostels',
    'Chiller Plants',
    'STP'
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></div>
          Power Consumption Trends
        </h2>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Click legend to highlight
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={11}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666" 
              fontSize={11}
              tick={{ fill: '#666' }}
              label={{ value: 'Power (kWh)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
              onClick={(e) => setHighlightedSector(highlightedSector === e.dataKey ? null : e.dataKey)}
              iconType="line"
            />
            {sectorKeys.map((sector, index) => (
              <Line
                key={sector}
                type="monotone"
                dataKey={sector}
                stroke={BLUE_SHADES[index % Object.keys(BLUE_SHADES).length]}
                strokeWidth={highlightedSector === sector ? 4 : highlightedSector === null ? 2 : 1}
                strokeOpacity={highlightedSector === sector ? 1 : highlightedSector === null ? 1 : 0.3}
                dot={{ fill: BLUE_SHADES[index % Object.keys(BLUE_SHADES).length], strokeWidth: 1, r: 2 }}
                activeDot={{ r: 4, stroke: BLUE_SHADES[index % Object.keys(BLUE_SHADES).length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConsumptionTrendsChart;
