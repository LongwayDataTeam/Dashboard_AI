import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
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
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Purchase = () => {
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/purchase');
        setPurchaseData(response.data);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
        // Fallback data
        setPurchaseData({
          kpis: {
            total_purchase_value: 120000,
            total_orders: 250,
            average_order_value: 1200,
            pending_orders: 15,
            supplier_count: 25,
            on_time_delivery_rate: 92.5
          },
          charts: {
            purchase_by_supplier: {
              labels: ["Supplier A", "Supplier B", "Supplier C", "Supplier D"],
              data: [5000, 8000, 4000, 6000]
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
    return <div>Loading purchase data...</div>;
  }

  const { kpis, charts } = purchaseData;

  // Purchase by supplier chart data
  const purchaseBySupplierData = {
    labels: charts.purchase_by_supplier.labels,
    datasets: [
      {
        label: 'Purchase Amount',
        data: charts.purchase_by_supplier.data,
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

  // Order status data
  const orderStatusData = {
    labels: ['Delivered', 'In Transit', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status',
        data: [
          kpis.total_orders - kpis.pending_orders - 10 - 5, // Delivered
          10, // In Transit
          kpis.pending_orders, // Pending
          5 // Cancelled
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutChartOptions = {
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
      <h1 className="page-title">Purchase Management</h1>

      <div className="grid-container">
        <div className="grid-item">
          <KPICard 
            title="Total Purchase Value" 
            value={`$${kpis.total_purchase_value.toLocaleString()}`} 
            trend={6.2} 
            trendLabel="vs last month" 
            color="#1976d2"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Total Orders" 
            value={kpis.total_orders.toLocaleString()} 
            trend={4.5} 
            trendLabel="vs last month" 
            color="#9c27b0"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Average Order Value" 
            value={`$${kpis.average_order_value.toLocaleString()}`} 
            trend={1.8} 
            trendLabel="vs last month" 
            color="#2e7d32"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Pending Orders" 
            value={kpis.pending_orders.toLocaleString()} 
            trend={-2.3} 
            trendLabel="vs last month" 
            color="#ed6c02"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Supplier Count" 
            value={kpis.supplier_count.toLocaleString()} 
            trend={2.0} 
            trendLabel="vs last month" 
            color="#0288d1"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="On-time Delivery Rate" 
            value={`${kpis.on_time_delivery_rate}%`} 
            trend={1.5} 
            trendLabel="vs last month" 
            color="#d32f2f"
          />
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-item" style={{ gridColumn: 'span 2' }}>
          <ChartContainer title="Purchase by Supplier">
            <div className="chart-box">
              <Bar data={purchaseBySupplierData} options={barChartOptions} />
            </div>
          </ChartContainer>
        </div>
        <div className="grid-item">
          <ChartContainer title="Order Status">
            <div className="chart-box">
              <Doughnut data={orderStatusData} options={doughnutChartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Purchase; 