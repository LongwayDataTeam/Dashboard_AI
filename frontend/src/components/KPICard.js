import React from 'react';
import '../assets/kpicard.css';

const KPICard = ({ title, value, trend, trendLabel, color }) => {
  const isPositive = trend > 0;
  
  return (
    <div className="kpi-card" style={{ borderLeftColor: color || '#1976d2' }}>
      <div className="card-content">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-value">{value}</div>
          {trend !== undefined && (
            <div className={`card-trend ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard; 