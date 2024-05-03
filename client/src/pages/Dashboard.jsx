import '../css/dashboard.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox, faTools } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  // Sample data arrays
  const [suppliersData, setSuppliersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const inventoryData = [
    { unit: 'Unit A', Handlebars: 20, Frames: 50, Saddles: 30, Chains: 0, Wheels: 0, Pedals: 0, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit B', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 40, Wheels: 70, Pedals: 50, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit C', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 0, Wheels: 0, Pedals: 0, Forks: 30, Brakes: 40, Tires: 60, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit D', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 0, Wheels: 0, Pedals: 0, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 100, BMX: 100, 'Hybrid Bike': 100, 'Road Bike': 100 },
    // Add more data as needed
  ];
  
  const productionData = [
    { name: 'January', output: 50, defects: 5 },
    { name: 'February', output: 70, defects: 7 },
    { name: 'March', output: 90, defects: 9 },
    // Add more data as needed
  ];


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
        //const currentYear = new Date().getFullYear(); // Get current year
        const currentYear = 2022;
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
    const fetchSuppliersData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getOrders');
        console.log('Response data:', response.data); // Log the response data
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

        const suppliersData = Object.keys(suppliersMap).map(supplierName => ({
          supplier: supplierName,
          orders: suppliersMap[supplierName].orderCount,
          deliveryTime: suppliersMap[supplierName].totalLeadTime / suppliersMap[supplierName].orderCount
        }));
        
        setSuppliersData(suppliersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers data:', error);
        setLoading(false);
      }
    };

    fetchSuppliersData();
  }, []);
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#e34c26', '#ff7f0e', '#2ca02c', '#9467bd', '#8c564b', '#1f77b4', '#ff00ff', '#ff99ff', '#33cc33', '#ff3300'];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="dashboard">
      <div className="header">
        <h1>Bike Factory Supply Chain Management Dashboard</h1>
        <div className="buttons">
          <button className="button orders" onClick={() => scrollToSection('orders-section')}>Orders</button>
          <button className="button inventory" onClick={() => scrollToSection('inventory-section')}>Inventory</button>
          <button className="button production" onClick={() => scrollToSection('production-section')}>Production</button>
          <button className="button suppliers" onClick={() => scrollToSection('suppliers-section')}>Suppliers</button>
        </div>
      </div>
      <div className="graphs">
        {/* Orders Section */}
        <div className="chart-container" id="orders-section">
  <div className="chart">
    <h2>Orders Overview</h2>
    <BarChart width={800} height={400} data={ordersData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="orders" fill="#ffd166" name="Total Orders" />
      <Bar dataKey="revenue" fill="#06d6a0" name="Total Revenue" />
    </BarChart>
  </div>
  <div className="stat-box-container">
    <div className="stat-box orders" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#ffd166' }}>
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
        {/* Inventory Section */}
        <div className="chart-container" id="inventory-section">
          <div className="chart">
            <h2>Inventory Breakdown</h2>
            <BarChart width={800} height={400} data={inventoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="unit" type="category" />
              <Tooltip />
              <Legend />
              {Object.keys(inventoryData[0]).map((key, index) => (
                key !== 'unit' &&
                <Bar key={key} dataKey={key} stackId="a" fill={colors[index]} />
              ))}
            </BarChart>
          </div>
          <div className="stat-box-container">
            {inventoryData.map((item, index) => (
              <div className="stat-box inventory" key={index} onClick={() => scrollToSection('inventory-section')} style={{ backgroundColor: colors[index] }}>
                <FontAwesomeIcon icon={faBox} className="stat-icon" />
                <div className="stat-content">
                  <h3>{item.unit} </h3>
                  <p>{ordersData.reduce((total, order) => total + order.total_price, 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Production Section */}
        <div className="chart-container" id="production-section">
          <div className="chart">
            <h2>Production Output</h2>
            <LineChart width={800} height={400} data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="output" stroke="#118ab2" />
              <Line type="monotone" dataKey="defects" stroke="#ef476f" />
            </LineChart>
          </div>
          <div className="stat-box-container">
            <div className="stat-box production" onClick={() => scrollToSection('production-section')}>
              <FontAwesomeIcon icon={faTools} className="stat-icon" />
              <div className="stat-content">
                <h3>Production Output</h3>
                <p>210</p>
              </div>
            </div>
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
              <div className="stat-box suppliers" key={index}>
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