
// import '../css/Home.css'
// import React from 'react';

// const Home = () => {
//   return (
//     <>
//     <h2>Order Now From the comfort of your couch</h2>
    
//     <button>
//       hello
//     </button>
//     </>
//   )
// }

// export default Home

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowRight, faBox, faClipboardList, faTruck, faChartLine, faTools, faChartBar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Import faArrowRight
import { Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

import '../css/Home.css';

const Home = () => {
  // Placeholder data for the radar chart
  const radarData = [
    { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
    { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
    { subject: 'Development', A: 86, B: 130, fullMark: 150 },
    { subject: 'Customer Support', A: 99, B: 100, fullMark: 150 },
    { subject: 'HR', A: 85, B: 90, fullMark: 150 },
  ];

  // Placeholder data for other charts
  const productionData = [
    { month: 'Jan', production: 4000, defects: 2400 },
    { month: 'Feb', production: 3000, defects: 1398 },
    { month: 'Mar', production: 2000, defects: 9800 },
    { month: 'Apr', production: 2780, defects: 3908 },
    { month: 'May', production: 1890, defects: 4800 },
    { month: 'Jun', production: 2390, defects: 3800 },
    { month: 'Jul', production: 3490, defects: 4300 },
  ];

  const suppliersData = [
    { name: 'Supplier A', orders: 20 },
    { name: 'Supplier B', orders: 15 },
    { name: 'Supplier C', orders: 10 },
    { name: 'Supplier D', orders: 8 },
    { name: 'Supplier E', orders: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
     
    <div className="home-container">
      <div className="header">
        <div className="header-content">
          <Typography variant="h2" className="title animated-title">
            Welcome to Bike Factory SCM
          </Typography>
          <Typography variant="body1" className="subtitle">
            Your one-stop solution for bike manufacturing supply chain management
          </Typography>
          <div className="links">
            <Link to="/about" className="link">
              About Us
            </Link>
            <Link to="/contact" className="link">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="home-container">

      <section className="hero">
        <div className="hero-content">
          <h1>Streamline Your Bike Factory's Supply Chain with [App Name]</h1>
          <p>Empower your bike manufacturing process with our comprehensive supply chain management solution.</p>
          <Link to="/signup" className="cta-button">
            Get Started <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
          </Link>
        </div>
      </section>

      <section className="key-features">
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="feature">
            <FontAwesomeIcon icon={faBox} className="icon" />
            <div className="description">
              <h3>Inventory Management</h3>
              <p>Efficiently manage bike parts inventory with real-time tracking.</p>
            </div>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            <div className="description">
              <h3>Order Tracking</h3>
              <p>Track orders from placement to delivery, ensuring timely fulfillment.</p>
            </div>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faTruck} className="icon" />
            <div className="description">
              <h3>Supplier Management</h3>
              <p>Manage supplier relationships and streamline communication for seamless procurement.</p>
            </div>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faChartLine} className="icon" />
            <div className="description">
              <h3>Production Planning</h3>
              <p>Plan and schedule bike production processes to optimize efficiency and meet demand.</p>
            </div>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faTools} className="icon" />
            <div className="description">
              <h3>Real-Time Data and Analytics</h3>
              <p>Access real-time data and analytics to make informed decisions and improve performance.</p>
            </div>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faChartBar} className="icon" />
            <div className="description">
              <h3>Quality Control Management</h3>
              <p>Implement quality control measures to ensure the highest standards in bike manufacturing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Benefits</h2>
        <div className="benefits-container">
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Reduce inventory carrying costs by 20% with optimized stock management.</p>
            </div>
          </div>
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Improve production efficiency through real-time data insights.</p>
            </div>
          </div>
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Enhance visibility across your supply chain for better planning and decision-making.</p>
            </div>
          </div>
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Streamline order processing and reduce lead times.</p>
            </div>
          </div>
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Optimize resource utilization and minimize production downtime.</p>
            </div>
          </div>
          <div className="benefit">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div className="description">
              <p>Ensure product quality and customer satisfaction with robust quality control measures.</p>
            </div>
          </div>
        </div>
      </section>
    </div>


    </div>
      <div className="container">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h5" className="chart-title">Production Trends</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={productionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="production" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h5" className="chart-title">Suppliers</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={suppliersData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Add other charts here */}

          <Grid item xs={12} md={6}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h5" className="chart-title">Radar Chart</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={150} width={300} height={300} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Tooltip />
                    <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      <div className="introduction">
        <Typography variant="h3">Introduction</Typography>
        <Typography variant="body1">
          Welcome to Bike Factory SCM, your premier solution for managing your bike manufacturing supply chain. With our comprehensive suite of tools and analytics, you can optimize your production processes, track supplier performance, manage inventory, and much more.
        </Typography>
      </div>
    </div>
  );
};

export default Home;



