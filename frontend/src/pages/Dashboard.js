import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import axios from 'axios';
import '../assets/pages.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
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
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback data
        setDashboardData({
          kpis: {
            total_sales: 75000,
            total_orders: 750,
            total_customers: 350,
            average_order_value: 200,
            conversion_rate: 3.5,
            revenue_growth: 5.2
          },
          charts: {
            monthly_sales: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              data: [12000, 15000, 10000, 18000, 14000, 16000, 17000, 19000, 16000, 20000, 22000, 18000]
            },
            daily_sales: {
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              data: [250, 300, 280, 320, 350, 400, 380]
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  const { kpis, charts } = dashboardData;

  // Chart options and data
  const monthlySalesData = {
    labels: charts.monthly_sales.labels,
    datasets: [
      {
        label: 'Monthly Sales',
        data: charts.monthly_sales.data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dailySalesData = {
    labels: charts.daily_sales.labels,
    datasets: [
      {
        label: 'Daily Sales',
        data: charts.daily_sales.data,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    if (!user) return "Welcome to Dashboard AI";
    
    switch(user.role) {
      case 'admin':
        return `Welcome, Administrator ${user.name}`;
      case 'manager':
        return `Welcome, Manager ${user.name}`;
      case 'analyst':
        return `Welcome, Analyst ${user.name}`;
      default:
        return `Welcome, ${user.name}`;
    }
  };

  // Role-specific KPI visibility
  const shouldShowKPI = (kpiName) => {
    if (!user) return true;
    
    // Admin sees everything
    if (user.role === 'admin') return true;
    
    // Manager sees most KPIs except some sensitive ones
    if (user.role === 'manager') {
      return kpiName !== 'conversion_rate';
    }
    
    // Analyst sees only basic KPIs
    if (user.role === 'analyst') {
      return ['total_sales', 'total_orders', 'total_customers'].includes(kpiName);
    }
    
    return true;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">{getWelcomeMessage()}</h1>
      
      {user && user.role === 'admin' && (
        <div className="role-indicator admin">
          You have full access to all dashboard features and data
        </div>
      )}
      
      {user && user.role === 'manager' && (
        <div className="role-indicator manager">
          You have access to operational data and limited financial insights
        </div>
      )}
      
      {user && user.role === 'analyst' && (
        <div className="role-indicator analyst">
          You have access to basic sales and customer data for analysis
        </div>
      )}

      <div className="grid-container">
        {shouldShowKPI('total_sales') && (
          <div className="grid-item">
            <KPICard 
              title="Total Sales" 
              value={`$${kpis.total_sales.toLocaleString()}`} 
              trend={kpis.revenue_growth} 
              trendLabel="vs last month" 
              color="#1976d2"
            />
          </div>
        )}
        
        {shouldShowKPI('total_orders') && (
          <div className="grid-item">
            <KPICard 
              title="Total Orders" 
              value={kpis.total_orders.toLocaleString()} 
              trend={4.7} 
              trendLabel="vs last month" 
              color="#9c27b0"
            />
          </div>
        )}
        
        {shouldShowKPI('total_customers') && (
          <div className="grid-item">
            <KPICard 
              title="Total Customers" 
              value={kpis.total_customers.toLocaleString()} 
              trend={3.2} 
              trendLabel="vs last month" 
              color="#2e7d32"
            />
          </div>
        )}
        
        {shouldShowKPI('average_order_value') && (
          <div className="grid-item">
            <KPICard 
              title="Average Order Value" 
              value={`$${kpis.average_order_value.toLocaleString()}`} 
              trend={1.8} 
              trendLabel="vs last month" 
              color="#ed6c02"
            />
          </div>
        )}
        
        {shouldShowKPI('conversion_rate') && (
          <div className="grid-item">
            <KPICard 
              title="Conversion Rate" 
              value={`${kpis.conversion_rate}%`} 
              trend={0.5} 
              trendLabel="vs last month" 
              color="#d32f2f"
            />
          </div>
        )}
        
        {shouldShowKPI('revenue_growth') && (
          <div className="grid-item">
            <KPICard 
              title="Revenue Growth" 
              value={`${kpis.revenue_growth}%`} 
              trend={kpis.revenue_growth} 
              trendLabel="vs last month" 
              color="#0288d1"
            />
          </div>
        )}
      </div>

      <div className="grid-container">
        <div className="grid-item" style={{ gridColumn: 'span 2' }}>
          <ChartContainer title="Monthly Sales">
            <div className="chart-box">
              <Bar data={monthlySalesData} options={chartOptions} />
            </div>
          </ChartContainer>
        </div>
        <div className="grid-item">
          <ChartContainer title="Daily Sales Trend">
            <div className="chart-box">
              <Line data={dailySalesData} options={chartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>
      
      {user && user.role === 'admin' && (
        <div className="admin-notes">
          <h3>Administrator Notes</h3>
          <ul>
            <li>All KPIs are showing positive trends this month</li>
            <li>System performance is optimal with 99.9% uptime</li>
            <li>3 new manager accounts were created this week</li>
            <li>Quarterly financial reports are due next week</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 