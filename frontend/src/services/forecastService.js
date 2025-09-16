const ForecastService = {
  async getForecast(days) {
    try {
      const response = await fetch(`http://localhost:8000/forecast?days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // Return mock data for demo purposes
      return this.getMockData(days);
    }
  },

  getMockData(days) {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const baseValue = 100 + Math.sin(i * 0.1) * 20;
      data.push({
        date: date.toISOString().split('T')[0],
        ANN: Math.round((baseValue + Math.random() * 10 - 5) * 100) / 100,
        LSTM: Math.round((baseValue + Math.random() * 8 - 4) * 100) / 100,
        Hybrid: Math.round((baseValue + Math.random() * 6 - 3) * 100) / 100,
      });
    }
    return data;
  }
};

export default ForecastService;
