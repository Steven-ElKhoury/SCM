import Navbar from './Navbar'

import About from './pages/About'
import Home from './pages/Home'
import Products from './pages/Products'
import Shoes from './pages/Shoes';
import Shirts from './pages/Shirts';
import Pants from './pages/Pants';
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Axios from 'axios'
import Login from './pages/Login'
import Main from './pages/Main'


function App() {
  return (
    <div>
      <div className='container'>
        <Routes>
          <Route path='/' element = {<Login/>}></Route>
          <Route path='/main/*' element={<Main/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
