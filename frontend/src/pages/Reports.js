import React, { useState, useEffect } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import axios from 'axios';
import '../assets/pages.css';
import '../assets/reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        // Fallback data
        setReportData({
          kpis: {
            revenue_growth: 8.5,
            profit_growth: 7.2,
            customer_growth: 5.8,
            average_order_growth: 3.2,
            inventory_turnover_change: 1.5,
            return_rate_change: -0.8
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading report data...</div>;
  }

  const { kpis } = reportData;

  // Performance metrics data
  const performanceData = {
    labels: ['Revenue', 'Profit', 'Customers', 'Orders', 'Inventory', 'Returns'],
    datasets: [
      {
        label: 'Current Period',
        data: [85, 75, 70, 65, 60, 50],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      },
      {
        label: 'Previous Period',
        data: [70, 65, 60, 60, 55, 55],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }
    ]
  };

  // Growth trend data
  const growthTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue Growth',
        data: [2.5, 3.2, 4.1, 5.3, 7.2, 8.5],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Profit Growth',
        data: [1.8, 2.5, 3.5, 4.8, 6.5, 7.2],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Customer Growth',
        data: [1.2, 2.0, 2.8, 3.5, 4.5, 5.8],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.4,
      }
    ]
  };

  // Top products data
  const topProducts = [
    { id: 1, name: 'Product A', sales: 1250, revenue: 25000, profit: 8750 },
    { id: 2, name: 'Product B', sales: 980, revenue: 19600, profit: 6860 },
    { id: 3, name: 'Product C', sales: 850, revenue: 17000, profit: 5950 },
    { id: 4, name: 'Product D', sales: 720, revenue: 14400, profit: 5040 },
    { id: 5, name: 'Product E', sales: 650, revenue: 13000, profit: 4550 },
  ];

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Role-specific KPI visibility
  const shouldShowKPI = (kpiName) => {
    if (!user) return true;
    
    // Admin sees everything
    if (user.role === 'admin') return true;
    
    // Manager sees most KPIs except profit-related ones
    if (user.role === 'manager') {
      return !['profit_growth'].includes(kpiName);
    }
    
    // Analyst sees only customer and order related KPIs
    if (user.role === 'analyst') {
      return ['customer_growth', 'average_order_growth'].includes(kpiName);
    }
    
    return true;
  };

  // Check if user can see profit data
  const canSeeProfitData = () => {
    return !user || user.role === 'admin';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Reports & Analytics</h1>
      
      {user && user.role === 'analyst' && (
        <div className="role-indicator analyst">
          Note: As an analyst, you have limited access to financial reports
        </div>
      )}

      <div className="grid-container">
        {shouldShowKPI('revenue_growth') && (
          <div className="grid-item">
            <KPICard 
              title="Revenue Growth" 
              value={`${kpis.revenue_growth}%`} 
              trend={kpis.revenue_growth} 
              trendLabel="vs last period" 
              color="#1976d2"
            />
          </div>
        )}
        
        {shouldShowKPI('profit_growth') && (
          <div className="grid-item">
            <KPICard 
              title="Profit Growth" 
              value={`${kpis.profit_growth}%`} 
              trend={kpis.profit_growth} 
              trendLabel="vs last period" 
              color="#2e7d32"
            />
          </div>
        )}
        
        {shouldShowKPI('customer_growth') && (
          <div className="grid-item">
            <KPICard 
              title="Customer Growth" 
              value={`${kpis.customer_growth}%`} 
              trend={kpis.customer_growth} 
              trendLabel="vs last period" 
              color="#9c27b0"
            />
          </div>
        )}
        
        {shouldShowKPI('average_order_growth') && (
          <div className="grid-item">
            <KPICard 
              title="Average Order Growth" 
              value={`${kpis.average_order_growth}%`} 
              trend={kpis.average_order_growth} 
              trendLabel="vs last period" 
              color="#ed6c02"
            />
          </div>
        )}
        
        {shouldShowKPI('inventory_turnover_change') && (
          <div className="grid-item">
            <KPICard 
              title="Inventory Turnover Change" 
              value={`${kpis.inventory_turnover_change}%`} 
              trend={kpis.inventory_turnover_change} 
              trendLabel="vs last period" 
              color="#0288d1"
            />
          </div>
        )}
        
        {shouldShowKPI('return_rate_change') && (
          <div className="grid-item">
            <KPICard 
              title="Return Rate Change" 
              value={`${kpis.return_rate_change}%`} 
              trend={kpis.return_rate_change} 
              trendLabel="vs last period" 
              color="#d32f2f"
            />
          </div>
        )}
      </div>

      <div className="grid-container">
        <div className="grid-item" style={{ gridColumn: 'span 2' }}>
          <ChartContainer title="Growth Trends">
            <div className="chart-box">
              <Line 
                data={{
                  ...growthTrendData,
                  datasets: growthTrendData.datasets.filter(dataset => 
                    dataset.label !== 'Profit Growth' || canSeeProfitData()
                  )
                }} 
                options={lineChartOptions} 
              />
            </div>
          </ChartContainer>
        </div>
        <div className="grid-item">
          <ChartContainer title="Performance Metrics">
            <div className="chart-box">
              <Radar data={performanceData} options={radarChartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>

      {(user && (user.role === 'admin' || user.role === 'manager')) && (
        <div className="grid-container">
          <div className="grid-item" style={{ gridColumn: 'span 3' }}>
            <ChartContainer title="Top Performing Products">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      {canSeeProfitData() && <th>Profit</th>}
                      {canSeeProfitData() && <th>Profit Margin</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sales.toLocaleString()}</td>
                        <td>${product.revenue.toLocaleString()}</td>
                        {canSeeProfitData() && <td>${product.profit.toLocaleString()}</td>}
                        {canSeeProfitData() && (
                          <td>
                            {((product.profit / product.revenue) * 100).toFixed(1)}%
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartContainer>
          </div>
        </div>
      )}
      
      {user && user.role === 'analyst' && (
        <div className="analyst-message">
          <p>To view detailed product performance data, please contact your manager for access.</p>
        </div>
      )}
    </div>
  );
};

export default Reports; 