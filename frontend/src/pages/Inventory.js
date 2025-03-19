import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
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

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventory');
        setInventoryData(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        // Fallback data
        setInventoryData({
          kpis: {
            total_items: 3500,
            low_stock_items: 25,
            out_of_stock: 12,
            inventory_value: 125000,
            inventory_turnover: 5.2,
            average_days_in_inventory: 35
          },
          charts: {
            inventory_by_category: {
              labels: ["Electronics", "Clothing", "Food", "Furniture", "Books"],
              data: [350, 420, 180, 250, 300]
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
    return <div>Loading inventory data...</div>;
  }

  const { kpis, charts } = inventoryData;

  // Chart data
  const inventoryByCategoryData = {
    labels: charts.inventory_by_category.labels,
    datasets: [
      {
        label: 'Items in Stock',
        data: charts.inventory_by_category.data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Stock status data
  const stockStatusData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Stock Status',
        data: [
          kpis.total_items - kpis.low_stock_items - kpis.out_of_stock,
          kpis.low_stock_items,
          kpis.out_of_stock
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
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
      <h1 className="page-title">Inventory Management</h1>

      <div className="grid-container">
        <div className="grid-item">
          <KPICard 
            title="Total Items" 
            value={kpis.total_items.toLocaleString()} 
            color="#1976d2"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Low Stock Items" 
            value={kpis.low_stock_items.toLocaleString()} 
            trend={-5.3} 
            trendLabel="vs last month" 
            color="#ed6c02"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Out of Stock" 
            value={kpis.out_of_stock.toLocaleString()} 
            trend={-2.1} 
            trendLabel="vs last month" 
            color="#d32f2f"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Inventory Value" 
            value={`$${kpis.inventory_value.toLocaleString()}`} 
            trend={3.8} 
            trendLabel="vs last month" 
            color="#2e7d32"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Inventory Turnover" 
            value={kpis.inventory_turnover.toFixed(1)} 
            trend={0.7} 
            trendLabel="vs last month" 
            color="#9c27b0"
          />
        </div>
        <div className="grid-item">
          <KPICard 
            title="Avg Days in Inventory" 
            value={kpis.average_days_in_inventory.toLocaleString()} 
            trend={-1.5} 
            trendLabel="vs last month" 
            color="#0288d1"
          />
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-item" style={{ gridColumn: 'span 2' }}>
          <ChartContainer title="Inventory by Category">
            <div className="chart-box">
              <Bar data={inventoryByCategoryData} options={barChartOptions} />
            </div>
          </ChartContainer>
        </div>
        <div className="grid-item">
          <ChartContainer title="Stock Status">
            <div className="chart-box">
              <Doughnut data={stockStatusData} options={doughnutChartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 