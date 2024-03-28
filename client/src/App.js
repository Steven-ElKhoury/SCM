import Navbar from './Navbar'

import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Axios from 'axios'
import Login from './pages/Login'
import Main from './pages/Main'
import Suppliers from './pages/Suppliers';


function App() {
  return (
    <div>
      <div className='container'>
        <Routes>
          <Route path='/' element = {<Login/>}></Route>
          <Route path='/main/*' element={<Main/>}></Route>
          <Route path='/suppliers/' element={<Suppliers/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
