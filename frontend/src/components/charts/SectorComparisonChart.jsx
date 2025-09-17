import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SectorComparisonChart = ({ data }) => {
  console.log('[SectorComparisonChart] data:', data);

  const blueShades = [
    '#1e40af', // blue-800
    '#2563eb', // blue-600
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
    '#93c5fd', // blue-300
    '#bfdbfe', // blue-200
    '#dbeafe', // blue-100
    '#1d4ed8', // blue-700
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3"></div>
          Total Consumption by Sector
        </h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          Comparison
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 50 }}>
            <defs>
              {blueShades.map((color, index) => (
                <linearGradient key={index} id={`blueGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.4}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
            <XAxis 
              dataKey="sector" 
              stroke="#666" 
              fontSize={10}
              tick={{ fill: '#666' }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666" 
              fontSize={11}
              tick={{ fill: '#666' }}
              label={{ value: 'Power (kWh)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-blue-100 rounded-lg shadow-xl">
                      <p className="font-medium text-gray-700 mb-1">{label.replace('\n', ' ')}</p>
                      <p className="text-lg font-bold text-blue-600">
                        {payload[0].value.toLocaleString()} kWh
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="consumption" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#blueGradient${index % blueShades.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SectorComparisonChart;
