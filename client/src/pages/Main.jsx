import {React, useState} from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AcceptEmployee from "./AcceptEmployee";
import "../css/Main.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Employees from "./Employees";
import CreateEmployee from "./createEmployee";
import Suppliers from "./Suppliers";
import Products from "./Products";
import CreateProduct from "./createProduct";
import Warehouses from "./warehouse";
import Parts from "./Parts";
import EditProduct from "./editProduct";
import CreatePart from "./createPart";
import EditPart from "./editPart";
import CreateStorageUnit from "./createWarehouse";
import EditStorageUnit from "./editWarehouse";
import Orders from "./Orders"
import CreateOrder from "./createOrder";
import ViewOrders from "./viewOrders";
import ProductBlueprint from "./ProductBlueprint";
import ViewParts from "./ViewParts";
import TaskAssignment from "./TaskAssignment.jsx";
import Purchases from './Purchases';
import Dashboard from './Dashboard';
import CreatePartType from './createPartType.jsx';
import CreateBikeType from './createBikeType.jsx';
import Manufacture from './Manufacture';

export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // var isAdmin = sessionStorage.getItem('isadmin');
  // console.log("AAAAAAAAAAAAAAAAAAAAAA" + isAdmin)

  return (
    <div className="dashboard-container" >
    <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className="dashboard-main-container">
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
   <div className={`body-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="scrollable-content">
            <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="tasks" element={<TaskAssignment />} />
                  <Route path="/createEmployee" element={<CreateEmployee />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/acceptemployee" element={<AcceptEmployee />} />
                  <Route path="products" element={<Products />} />
                  <Route path="createProduct" element={<CreateProduct />} />
                  <Route path="warehouses" element={<Warehouses />} />
                  <Route path="parts" element={<Parts />} />
                  <Route path="editProduct/:id" element={<EditProduct />} />
                  <Route path="createPart" element={<CreatePart />} />
                  <Route path = "editPart/:id" element = {<EditPart/>} />
                  <Route path = "createUnit" element = {<CreateStorageUnit/>} />
                  <Route path = "editUnit/:id" element = {<EditStorageUnit/>} />
                  <Route path = "/Orders" element = {<Orders />} />
                  <Route path = 'createOrder' element = {<CreateOrder/>} />
                  <Route path = 'viewOrders' element = {<ViewOrders/>} />
                  <Route path="addParts/:modelId" element={<ProductBlueprint />} /> {/* Add this line */}
                  <Route path="viewParts/:modelId" element={<ViewParts />} /> {/* Add this line */}
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/createPartType" element={<CreatePartType />} />
                  <Route path="/createBikeType" element={<CreateBikeType/>} />
                  <Route path="/manufacture" element={<Manufacture />} />
            </Routes>
        </div>
    </div>
   </div>
</div>
  )
}