import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ForecastChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading forecast data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 30, right: 40, left: 40, bottom: 30 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" strokeOpacity={0.7} />
          <XAxis 
            dataKey="date" 
            stroke="#374151"
            fontSize={11}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            stroke="#374151" 
            fontSize={11}
            tickMargin={10}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip 
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value, name) => [
              value.toFixed(3), 
              name.replace(' Model', '')
            ]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '13px'
            }}
            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '2 2' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="ANN" 
            stroke="#1d4ed8" 
            strokeWidth={3}
            dot={{ fill: '#1d4ed8', strokeWidth: 0, r: 0 }}
            activeDot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2, fill: 'white' }}
            name="ANN Model"
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="LSTM" 
            stroke="#dc2626" 
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ fill: '#dc2626', strokeWidth: 0, r: 0 }}
            activeDot={{ r: 4, stroke: '#dc2626', strokeWidth: 2, fill: 'white' }}
            name="LSTM Model"
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="Hybrid" 
            stroke="#059669" 
            strokeWidth={3}
            strokeDasharray="4 2 2 2"
            dot={{ fill: '#059669', strokeWidth: 0, r: 0 }}
            activeDot={{ r: 4, stroke: '#059669', strokeWidth: 2, fill: 'white' }}
            name="Hybrid Model"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
