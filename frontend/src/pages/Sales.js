import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Sales = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Fallback data
        setSalesData({
          kpis: {
            total_revenue: 250000,
            total_profit: 75000,
            profit_margin: 30,
            average_order_value: 200,
            return_rate: 2.5,
            customer_lifetime_value: 1200
          },
          charts: {
            monthly_revenue: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              data: [15000, 18000, 16000, 19000, 22000, 25000, 28000, 30000, 27000, 32000, 35000, 33000]
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
    return <div>Loading sales data...</div>;
  }

  const { kpis, charts } = salesData;

  // Revenue chart data
  const revenueData = {
    labels: charts.monthly_revenue.labels,
    datasets: [
      {
        label: 'Revenue',
        data: charts.monthly_revenue.data,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
      {
        label: 'Profit',
        data: charts.monthly_revenue.data.map(value => value * (kpis.profit_margin / 100)),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
      },
    ],
  };

  // Sales distribution data
  const salesDistributionData = {
    labels: ['Online', 'In-Store', 'Wholesale', 'Other'],
    datasets: [
      {
        label: 'Sales Distribution',
        data: [65, 20, 10, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Sales Analytics</h1>

      <div className="grid-container">
        <div className="grid-item">
          <KPICard 
            title="Total Revenue" 
            value={`$${kpis.total_revenue.toLocaleString()}`} 
            trend={8.5} 
            trendLabel="vs last month" 
            color="#1976d2"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Total Profit" 
            value={`$${kpis.total_profit.toLocaleString()}`} 
            trend={7.2} 
            trendLabel="vs last month" 
            color="#2e7d32"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Profit Margin" 
            value={`${kpis.profit_margin}%`} 
            trend={1.5} 
            trendLabel="vs last month" 
            color="#9c27b0"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Average Order Value" 
            value={`$${kpis.average_order_value.toLocaleString()}`} 
            trend={3.2} 
            trendLabel="vs last month" 
            color="#ed6c02"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Return Rate" 
            value={`${kpis.return_rate}%`} 
            trend={-0.5} 
            trendLabel="vs last month" 
            color="#d32f2f"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Customer Lifetime Value" 
            value={`$${kpis.customer_lifetime_value.toLocaleString()}`} 
            trend={5.8} 
            trendLabel="vs last month" 
            color="#0288d1"
          />
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-item" style={{ gridColumn: 'span 2' }}>
          <ChartContainer title="Monthly Revenue & Profit">
            <div className="chart-box">
              <Line data={revenueData} options={lineChartOptions} />
            </div>
          </ChartContainer>
        </div>
        <div className="grid-item">
          <ChartContainer title="Sales Distribution">
            <div className="chart-box">
              <Pie data={salesDistributionData} options={pieChartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Sales; 