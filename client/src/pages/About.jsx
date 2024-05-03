import React from 'react'
import '../css/about.css'

const About = () => {
  return (
    <div className='about' onLoad={window.scrollTo(0, 0)}>
      <div className='aboutslogan'>
        <img className='aboutpic' src={require("../pictures/port-img.avif")} alt="" />
        <h1 className='slogansentence'>Efficiency in Motion: Powering Tomorrow's Supply Chains</h1>
      </div>
      <div className="about-page">
        <div className="about-section">
          <img src={require("../pictures/office-pic.avif")} alt="Picture 1" />
          <p className="about-text">Track employee performance and assigned tasks</p>
        </div>
        <div className="about-section">
          <img src={require("../pictures/ofice-guy.avif")} alt="Picture 2" />
          <p className="about-text">Make resource management one click away</p>
        </div>
        <div className="about-section">
          <img src={require("../pictures/kpi-pic.avif")} alt="Picture 3" />
          <p className="about-text">Visualize key aspects of your factory</p>
        </div>
        <div className="about-section">
          <img src={require("../pictures/factory-pic.avif")} alt="Picture 4" />
          <p className="about-text">Get Real Time data of your factory</p>
        </div>
      </div>
      <div className='footer-dark'>
        <footer>
          <div className='about-container'>
            <div className='row'>
              <div className='two'>
                <h2>Contact</h2>
                <ul>
                  <li>
                    <a href='#Contact'>Phone: 71174172</a>
                  </li>
                  <li>
                    <a href='#Contact'>Email: Bike01.Shop01@hotmail.com</a>
                  </li>
                  <li>
                    <a href='#Contact'>instagram: @Bike01.Shop01</a>
                  </li>
                </ul>
              </div>
            </div>
            <p className='copyright'>
              <span className='blogo1'>Pedal</span>
              <span className='blogo2'>Nation</span> © 2022
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default About