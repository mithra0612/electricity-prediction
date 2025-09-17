import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../../common/CustomTooltip';

const SolarGenerationChart = ({ data }) => {
  const formatMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const formatDayMonth = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getTickIndices = () => {
    if (!data || data.length === 0) return [];
    
    const dataLength = data.length;
    
    // For one month (30 days or less), show alternate dates
    if (dataLength <= 31) {
      const indices = [];
      for (let i = 0; i < dataLength; i += 2) {
        indices.push(i);
      }
      return indices;
    }
    
    // For 3 months or less, show 1st and 15th of each month
    if (dataLength <= 90) { // Assuming daily data for ~3 months
      const indices = [];
      
      // Always include the first data point
      indices.push(0);
      
      data.forEach((item, index) => {
        const date = new Date(item.date);
        const day = date.getDate();
        if ((day === 1 || day === 15) && index !== 0) {
          indices.push(index);
        }
      });
      
      // Remove duplicates and sort
      return [...new Set(indices)].sort((a, b) => a - b);
    }
    
    // For more than 3 months, show 6 evenly distributed points
    let tickCount = 6;
    tickCount = Math.min(tickCount, dataLength);
    
    if (tickCount === 1) return [0];
    
    const indices = [];
    for (let i = 0; i < tickCount; i++) {
      const index = Math.floor((i * (dataLength - 1)) / (tickCount - 1));
      indices.push(index);
    }
    return indices;
  };

  const getTickFormatter = () => {
    if (!data || data.length === 0) return formatMonthName;
    return data.length <= 31 ? formatDayMonth : formatMonthName;
  };

  return (
    <div className="2xl:col-span-2 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-blue-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 animate-pulse"></div>
          Predicted Solar Power Generation
        </h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          Forecasting
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12}
              tick={{ fill: '#64748b' }}
              tickFormatter={getTickFormatter()}
              interval="preserveStartEnd"
              ticks={data ? getTickIndices().map(index => data[index].date) : []}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tick={{ fill: '#64748b' }}
              label={{ value: 'Power (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="generation" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fill="url(#solarGradient)"
              dot={{ fill: '#3b82f6', strokeWidth: 3, r: 3 }}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 5, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SolarGenerationChart;
