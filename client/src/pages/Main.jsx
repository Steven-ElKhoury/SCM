import {React, useState} from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../css/Main.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Employees from "./Employees";
import CreateEmployee from "./createEmployee";
import Suppliers from "./Suppliers";

export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="container">
    <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className="main-container">
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className={`body-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="scrollable-content">
            <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="createEmployee" element={<CreateEmployee />} />
                  <Route path="suppliers" element={<Suppliers />} />
              </Routes>
        </div>
    </div>
   </div>
</div>
  )
}
