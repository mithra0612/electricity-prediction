import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ForecastChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-slate-200 shadow-lg backdrop-blur-sm">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
            <div className="absolute inset-0 inline-block animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 border-r-blue-600"></div>
          </div>
          <p className="mt-4 text-slate-700 font-medium">Loading forecast data...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl border border-slate-200 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">No forecast data available</p>
          <p className="text-slate-500 text-sm mt-1">Please check your data source</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-slate-200/60 rounded-xl p-4 shadow-2xl">
          <div className="text-slate-800 font-semibold text-sm mb-2">
            📅 {new Date(label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-700 font-medium text-sm">
                {entry.name}: 
              </span>
              <span className="text-slate-900 font-bold text-sm">
                {entry.value.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 rounded-2xl shadow-xl border border-slate-200/60 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Forecast Analysis</h3>
            <p className="text-slate-600 text-sm">Hybrid Model Predictions</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full w-20"></div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="hybridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.4}/>
                <stop offset="50%" stopColor="#0d9488" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.05}/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              strokeOpacity={0.6}
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              fontWeight={500}
              tickMargin={15}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              fontWeight={500}
              tickMargin={15}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => value.toFixed(1)}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: '#10b981', 
                strokeWidth: 2, 
                strokeDasharray: '4 4',
                strokeOpacity: 0.8 
              }}
            />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '25px',
                fontSize: '14px',
                fontWeight: '600'
              }}
              iconType="rect"
              iconSize={12}
            />
            
            <Area 
              type="monotone" 
              dataKey="Hybrid" 
              stroke="#059669" 
              strokeWidth={3.5}
              fill="url(#hybridGradient)"
              name="🚀 Hybrid Model"
              connectNulls={false}
              dot={{ 
                fill: '#059669', 
                strokeWidth: 2, 
                stroke: '#ffffff',
                r: 4
              }}
              activeDot={{ 
                r: 7, 
                fill: '#059669',
                stroke: '#ffffff',
                strokeWidth: 3,
                filter: 'url(#glow)'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -translate-y-4 translate-x-4"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full translate-y-4 -translate-x-4"></div>
      </div>
      
      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Real-time data</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>📊 {data?.length || 0} data points</span>
            <span>⏱️ Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;