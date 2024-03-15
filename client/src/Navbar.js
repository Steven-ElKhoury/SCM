import React from 'react'
import { Link } from 'react-router-dom'
import './css/navbar.css'

const navbar = () => {
  const path = window.location.pathname


  return (
    <>
      <nav className='nav'>
        <ul className='nav__list'>
          <li className='nav__listlogo'>
            <img src={require('./pictures/bicycle.png')} alt='BikeShop' />
          </li>
          <li className='nav__listitem nav__listlogo' >
            SHOPNAME
          </li>

          <Link className='nav__listitem' to='home'>
            Home
          </Link>
          <Link className='nav__listitem' to='/products' location=''>
            All Products
          </Link>
          

          <Link className='nav__listitem' to='/about'>
            About
          </Link>

        </ul>
      </nav>
      <div class='distance'></div>
    </>
  )
}

export default navbar
