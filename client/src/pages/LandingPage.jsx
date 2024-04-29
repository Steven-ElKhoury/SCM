import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import About from './About'
import InitialTopBar from './InitialTopBar'

const LandingPage = () => {
  return (
    <>
        <InitialTopBar />
            <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
 
            </Routes>
    
    
    </>
  )
}

export default LandingPage