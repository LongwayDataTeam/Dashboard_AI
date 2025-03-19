import React from 'react';
import '../assets/chartcontainer.css';

const ChartContainer = ({ title, children }) => {
  return (
    <div className="chart-container">
      <div className="chart-content">
        <h3 className="chart-title">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default ChartContainer; 