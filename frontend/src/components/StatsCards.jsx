import React from 'react';

const StatsCards = ({ data }) => {
  if (!data || data.length === 0) return null;

  const latest = data[data.length - 1];
  
  const stats = [
    { name: 'ANN Model', value: latest.ANN?.toFixed(2) || 'N/A', color: 'blue' },
    { name: 'LSTM Model', value: latest.LSTM?.toFixed(2) || 'N/A', color: 'red' },
    { name: 'Hybrid Model', value: latest.Hybrid?.toFixed(2) || 'N/A', color: 'green' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      green: 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className={`p-6 rounded-lg border ${getColorClasses(stat.color)}`}>
          <h3 className="text-sm font-medium">{stat.name}</h3>
          <p className="text-2xl font-semibold mt-2">{stat.value}</p>
          <p className="text-xs mt-1 opacity-75">Latest prediction</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
