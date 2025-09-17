import React from 'react';
import { Zap, Sun, Battery, TrendingUp } from 'lucide-react';
import SolarDashboard from './components/SolarDashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <Zap size={32} />
        <h1>Electricity Prediction Dashboard</h1>
      </header>
      <SolarDashboard />
    </div>
  );
}

export default App;
