import React from 'react';

const SummaryCard = ({ title, value, unit, icon }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
          <p className="text-gray-500 text-sm">{unit}</p>
        </div>
        <div className="text-blue-700 ml-4">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
  