import {React, useState} from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../css/Main.css";
import Shirts from "./Shirts";
import Shoes from "./Shoes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Employees from "./Employees";
import CreateEmployee from "./createEmployee";

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
                  <Route path="shirts" element={<Shirts />} />
                  <Route path="shoes" element={<Shoes />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="createEmployee" element={<CreateEmployee />} />
              </Routes>
        </div>
    </div>
   </div>
</div>
  )
}
