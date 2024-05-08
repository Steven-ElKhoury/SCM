import '../css/dashboard.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox, faTools } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis,Cell,Pie,PieChart, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Sample data arrays
  const [suppliersData, setSuppliersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [OurordersData, setOurOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryBikeData, setInventoryBikeData] = useState([]);
  
 
  
 
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getPartWarehouses');
        console.log('Response data:', response.data); // Log the response data

        // Process response data to extract significant inventory information
        const processedData = response.data.map(item => {
          // Calculate percentage of current stock
          const currentStockPercentage = (item.component_storage_current_stock / item.component_storage_capacity) * 100;

          return {
            unit: item.component_storage_name,
            currentStockPercentage,
            capacity: item.component_storage_capacity,
            currentStock : item.component_storage_current_stock
          };
        });

        setInventoryData(processedData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);
  
  useEffect(() => {
    const fetchBikeInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getProductWarehouses');
        console.log('Response data:', response.data);

        const processedBikeData = response.data.map(item => {
        const currentStockBikePercentage = (item.byproduct_storage_current_stock / item.byproduct_storage_capacity) * 100;

          return {
            unit: item.byproduct_storage_name,
            currentStockBikePercentage,
            capacity: item.byproduct_storage_capacity,
            currentStock : item.byproduct_storage_current_stock
          };
        });

        setInventoryBikeData(processedBikeData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchBikeInventoryData();
  }, []);

 
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getbyProducts');
        console.log('Customer orders data:', response.data); // Log the response data
        const ordersData = response.data.map(order => ({
          date: new Date(order.date), // Assuming date format is compatible with Date constructor
          quantity: order.quantity,
          total_price: order.total_price
        }));
  
        // Filter orders for a specific year (e.g., 2024)
        const currentYear = new Date().getFullYear(); // Get current year
        //const currentYear = 2022;
        const filteredOrdersData = ordersData.filter(order => order.date.getFullYear() === currentYear);
  
        // Generate monthly summary
        const monthlySummary = filteredOrdersData.reduce((summary, order) => {
          const month = order.date.getMonth(); // Month index (0-11)
          const monthKey = `${currentYear}-${month + 1}`; // Key format: 'YYYY-MM'
  
          if (!summary[monthKey]) {
            summary[monthKey] = { orders: 0, revenue: 0 };
          }
  
          summary[monthKey].orders++;
          summary[monthKey].revenue += order.total_price;
  
          return summary;
        }, {});
  
        // Convert monthly summary to array of objects
        const ordersByMonth = Object.keys(monthlySummary).map(monthKey => ({
          month: monthKey,
          orders: monthlySummary[monthKey].orders,
          revenue: monthlySummary[monthKey].revenue
        }));
  
        setOrdersData(ordersByMonth);
        setLoading(false);
        console.log("isiiiiiiiiiiissssssssssssss",ordersData)
  
        // Calculate total revenue
        const totalRevenue = filteredOrdersData.reduce((total, order) => total + parseFloat(order.total_price), 0).toFixed(2);
        console.log('Total Revenue:', totalRevenue);
        setTotalRevenue(totalRevenue);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        setLoading(false);
      }
    };
  
    fetchCustomerOrders();
  }, []);
  


  useEffect(() => {
    const fetchOurOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getOrders');
        console.log('orders data:', response.data); // Log the response data
        const OurordersData = response.data.map(order => ({
          date: new Date(order.date_ordered), // Assuming date format is compatible with Date constructor
          quantity: order.quantity,
          total_price: order.price !== null ? parseFloat(order.price) : 0
        }));
  
        // Filter orders for a specific year (e.g., 2024)
        //const currentYear = new Date().getFullYear(); // Get current year
        const currentYear = 2024;
        const filteredOurOrdersData = OurordersData.filter(order => order.date.getFullYear() === currentYear);
  
        // Generate monthly summary
        const monthlySummary = filteredOurOrdersData.reduce((summary, order) => {
          const month = order.date.getMonth(); // Month index (0-11)
          const monthKey = `${currentYear}-${month + 1}`; // Key format: 'YYYY-MM'
  
          if (!summary[monthKey]) {
            summary[monthKey] = { orders: 0, expenses: 0 };
          }
  
          summary[monthKey].orders++;
          summary[monthKey].expenses += order.total_price;
  
          return summary;
        }, {});
  
        // Convert monthly summary to array of objects
        const ordersByMonth = Object.keys(monthlySummary).map(monthKey => ({
          month: monthKey,
          orders: monthlySummary[monthKey].orders,
          expenses: monthlySummary[monthKey].expenses
        }));
  
        setOurOrdersData(ordersByMonth);
        setLoading(false);
  
        // Calculate total Expenses
        const totalExpenses = filteredOurOrdersData.reduce((total, order) => total + parseFloat(order.total_price), 0).toFixed(2);
        console.log('Total  Expenses:', totalExpenses);
        setTotalExpenses(totalExpenses);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        setLoading(false);
      }
    };
  
    fetchOurOrders();
  }, []);

  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getOrders');
        console.log('Response data:', response.data);
        const suppliersMap = {};
        response.data.forEach(order => {
          const supplierName = order.supplier_name;
          const leadTime = order.lead_time;
          if (!suppliersMap[supplierName]) {
            suppliersMap[supplierName] = { totalLeadTime: 0, orderCount: 0 };
          }
          suppliersMap[supplierName].totalLeadTime += leadTime;
          suppliersMap[supplierName].orderCount++;
        });

        const suppliersData2 = Object.keys(suppliersMap).map(supplierName => ({
          supplier: supplierName,
          orders: suppliersMap[supplierName].orderCount,
          deliveryTime: suppliersMap[supplierName].totalLeadTime / suppliersMap[supplierName].orderCount
        }));
        
        setSuppliersData(suppliersData2);
        console.log("honnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
        console.log(suppliersData2)
        console.log(suppliersData)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers data:', error);
        setLoading(false);
      }
    };

    fetchSuppliersData();
  }, []);
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#e34c26', '#ff7f0e', '#2ca02c', '#9467bd', '#8c564b', '#1f77b4', '#ff00ff', '#ff99ff', '#33cc33', '#ff3300'];
  const colorfulBeautifulColors = [
    
      '#2980b9', // Dark cerulean
      '#8e44ad', // Deep lavender
      '#27ae60', // Dark sea green
      '#e67e22', // Gamboge
      '#c0392b', // Dark terra cotta
      '#16a085', // Dark cyan
      '#f39c12', // Dark tangerine
      '#2980b9'  // Dark cerulean
  
    
  ];
  
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section.scrollIntoView({ behavior: 'smooth' });
  };
  const [grossProfit, setGrossProfit] = useState(0);
  useEffect(() => {
    if (!loading) {
      const revenue = parseFloat(totalRevenue);
      const expenses = parseFloat(totalExpenses);
      const grossProfit = revenue - expenses;
      setGrossProfit(grossProfit.toFixed(2));
    }
  }, [loading, totalRevenue, totalExpenses]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1 className="h1Dashboard">Bike Factory Supply Chain Management Dashboard</h1>
        <div className="buttons">
          <button className="button orders" onClick={() => scrollToSection('orders-section')}>Orders</button>
          <button className="button inventory" onClick={() => scrollToSection('inventory-section')}>Inventory</button>
          <button className="button suppliers" onClick={() => scrollToSection('suppliers-section')}>Suppliers</button>
        </div>
        <div className="gross-profit">
  <h2>Gross Profit</h2>
  <p>${(totalRevenue - totalExpenses).toFixed(2)}</p>
</div>
      </div>
    
      <div className="graphs">
        {/* Orders Section */}
        <div className="chart-container" id="orders-section">
        <div className="chart">
  <h2>Customers Orders and Revenue Overview</h2>
  <BarChart width={800} height={400} data={ordersData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis yAxisId="left" />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="orders" fill="#008B8B" name="Total Orders" />
    
  </BarChart>
</div>
  <div className="stat-box-container">
    <div className="stat-box orders" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#008B8B' }}>
      <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
      <div className="stat-content">
        <h3>Total Orders</h3>
        <p>{ordersData.reduce((total, data) => total + data.orders, 0)}</p>
      </div>
    </div>
    <div className="stat-box revenue" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#06d6a0' }}>
      <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
      <div className="stat-content">
        <h3>Total Revenue</h3>
        <p>${totalRevenue}</p>
      </div>
    </div>
  
          </div>
        </div>
        {/* Our orders Section */}
        <div className="chart-container" id="orders-section">
  
  <div className="chart">
  <h2>Our Orders and Expenses Overview</h2>
  <BarChart width={800} height={400} data={OurordersData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis yAxisId="left" />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="orders" fill="#007B99" name="Total Orders" />
    <Bar yAxisId="right" dataKey="expenses" fill="#FF6B6B" name="Total Expenses" />
  </BarChart>
</div>
  <div className="stat-box-container">
    <div className="stat-box orders" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#007B99' }}>
      <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
      <div className="stat-content">
        <h3>Total Orders</h3>
        <p>{OurordersData.reduce((total, data) => total + data.orders, 0)}</p>
      </div>
    </div>
    <div className="stat-box revenue" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#FF6B6B' }}>
      <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
      <div className="stat-content">
        <h3>Total Expenses</h3> 
        <p>${totalExpenses}</p>
      </div>
    </div>
  
          </div>
        </div>
        {/* Inventory Section */}
        <div className="chart-container" id="inventory-section">
      <div className="chart-inventory">
        <h2>Inventory Breakdown for the Parts warehouse</h2>
        <BarChart width={800} height={800} data={inventoryData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="unit" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentStockPercentage" stackId="a" fill={colorfulBeautifulColors[0]} name="Current Stock Percentage" />
        </BarChart>
      </div>
      <div className="stat-box-container">
        {inventoryData.map((item, index) => (
          <div className="stat-box inventory" key={index} style={{ backgroundColor: colorfulBeautifulColors[index] }}>
            <FontAwesomeIcon icon={faBox} className="stat-icon" />
            <div className="stat-content">
              <h3>{item.unit}</h3>
              <p>Available Space: {item.capacity - item.currentStock} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="chart-container" id="inventory-section">
      <div className="chart">
        <h2>Inventory Breakdown for the Bikes warehouse</h2>
        <BarChart width={800} height={400} data={inventoryBikeData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="unit" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentStockBikePercentage" stackId="a" fill={colorfulBeautifulColors[0]} name="Current Stock Percentage" />
        </BarChart>
      </div>
      <div className="stat-box-container">
        {inventoryBikeData.map((item, index) => (
          <div className="stat-box inventory" key={index} style={{ backgroundColor: colorfulBeautifulColors[index] }}>
            <FontAwesomeIcon icon={faBox} className="stat-icon" />
            <div className="stat-content">
              <h3>{item.unit}</h3>
              <p>Available Space: {item.capacity - item.currentStock} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>

        {/* Suppliers Section */}
        <div className="chart-container" id="suppliers-section">
          <div className="chart">
            <h2>Supplier Orders</h2>
            <BarChart width={800} height={400} data={suppliersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#ef476f" name="Orders" />
              <Bar dataKey="deliveryTime" fill="#8884d8" name="Avg. Delivery Time (Days)" />
            </BarChart>
          </div>
          <div className="stat-box-container">
            {suppliersData.map((supplier, index) => (
              <div className="stat-box suppliers" key={index} style={{ backgroundColor: colorfulBeautifulColors[index] }}>
                <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
                <div className="stat-content">
                  <h3>Supplier {supplier.supplier}</h3>
                  <p>Orders: {supplier.orders}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;