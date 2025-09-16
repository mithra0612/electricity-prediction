import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span>{options.find(opt => opt.value === value)?.label}</span>
        <ChevronDown className={`float-right mt-1 h-4 w-4 transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
