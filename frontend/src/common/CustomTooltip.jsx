import React from 'react';

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} kWh (x3)
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">{data.value.toLocaleString()} kWh</p>
        <p className="text-sm font-medium text-blue-600">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};
