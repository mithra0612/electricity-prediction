import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Blue color palette with various shades
const BLUE_COLORS = [
  '#1e40af', // blue-700
  '#3b82f6', // blue-500
  '#60a5fa', // blue-400
  '#93c5fd', // blue-300
  '#dbeafe', // blue-100
  '#1d4ed8', // blue-600
  '#2563eb', // blue-600
  '#6366f1', // indigo-500
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-gray-800 font-medium">{`${payload[0].name}`}</p>
        <p className="text-blue-600 font-semibold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ConsumptionPieChart = ({ data }) => {
  // Sample data if none provided
  const sampleData = [
    { name: 'Electricity', value: 35 },
    { name: 'Gas', value: 25 },
    { name: 'Water', value: 20 },
    { name: 'Heating', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const chartData = data || sampleData;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Consumption Share
        </h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={BLUE_COLORS[index % BLUE_COLORS.length]}
                  className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      
    </div>
  );
};

export default ConsumptionPieChart;