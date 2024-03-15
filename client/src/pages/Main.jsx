import {React, useState} from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../css/Main.css";
import Shirts from "./Shirts";
import Shoes from "./Shoes";


export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="container">
    <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className="main-container">
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className={`body-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="scrollable-content">
          <p> Home</p>

        </div>
    </div>
   </div>
</div>
  )
}
