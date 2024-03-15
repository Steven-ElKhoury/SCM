import Navbar from './Navbar'
import Content from './Content'
import About from './pages/About'
import Home from './pages/Home'
import Products from './pages/Products'
import Shoes from './pages/Shoes';
import Shirts from './pages/Shirts';
import Pants from './pages/Pants';
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Axios from 'axios'

function App() {
  return (
    <div>
      helloz
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/products' element={<Products />}></Route>
          <Route path='/about' element={<About />}></Route>

          <Route path='/shoes' element={<Shoes />}></Route>
          <Route path='/shirts' element={<Shirts />}></Route>
          <Route path='/pants' element={<Pants />}></Route>
        </Routes>
      </div>
      <Content/>
      
    </div>
  )
}

export default App
