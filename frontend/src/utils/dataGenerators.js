export const generateSolarData = (months) => {
  const data = [];
  const baseGeneration = 1200;
  const daysPerMonth = 30;
  const totalDays = months * daysPerMonth;
  
  for (let i = 0; i < totalDays; i += Math.ceil(totalDays / 20)) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const seasonalFactor = 1 + 0.3 * Math.sin((i / totalDays) * 2 * Math.PI);
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      generation: Math.round(baseGeneration * seasonalFactor * randomFactor)
    });
  }
  return data;
};

export const generateConsumptionData = (months) => {
  const sectors = ['Staff Quarters', 'Academic Blocks', 'Hostels', 'Chiller Plants', 'STP'];
  const baseConsumption = {
    'Staff Quarters': 800,
    'Academic Blocks': 1500,
    'Hostels': 2200,
    'Chiller Plants': 1800,
    'STP': 600
  };
  
  const data = [];
  const daysPerMonth = 30;
  const totalDays = months * daysPerMonth;
  
  for (let i = 0; i < totalDays; i += Math.ceil(totalDays / 20)) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dataPoint = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    sectors.forEach(sector => {
      const seasonalFactor = sector === 'Chiller Plants' ? 
        1 + 0.4 * Math.sin((i / totalDays) * 2 * Math.PI + Math.PI) : 
        1 + 0.2 * Math.sin((i / totalDays) * 2 * Math.PI);
      const randomFactor = 0.85 + Math.random() * 0.3;
      dataPoint[sector] = Math.round(baseConsumption[sector] * seasonalFactor * randomFactor);
    });
    
    data.push(dataPoint);
  }
  return data;
};

export const COLORS = {
  'Staff Quarters': '#8884d8',
  'Academic Blocks': '#82ca9d',
  'Hostels': '#ffc658',
  'Chiller Plants': '#ff7c7c',
  'STP': '#8dd1e1'
};
