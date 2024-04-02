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
import AddParts from "./AddParts";
import Products from "./Products";
import CreateProduct from "./createProduct";
import Warehouses from "./warehouse";
import Parts from "./Parts";
import EditProduct from "./editProduct";
import CreatePart from "./createPart";
import EditPart from "./editPart";
import CreateStorageUnit from "./createWarehouse";
import EditStorageUnit from "./editWarehouse";
import Orders from "/Orders.jsx"


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
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/createEmployee" element={<CreateEmployee />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/acceptemployee" element={<AcceptEmployee />} />
                  <Route path="addParts" element={<AddParts />} />
                  <Route path="products" element={<Products />} />
                  <Route path="createProduct" element={<CreateProduct />} />
                  <Route path="warehouses" element={<Warehouses />} />
                  <Route path="parts" element={<Parts />} />
                  <Route path="addpart" element={<AddParts />} />
                  <Route path="editProduct/:id" element={<EditProduct />} />
                  <Route path="createPart" element={<CreatePart />} />
                  <Route path = "editPart/:id" element = {<EditPart/>} />
                  <Route path = "createUnit" element = {<CreateStorageUnit/>} />
                  <Route path = "editUnit/:id" element = {<EditStorageUnit/>} />
                  <Route path = "/Orders" element = {<Orders />} />
            </Routes>
        </div>
    </div>
   </div>
</div>
  )
}


