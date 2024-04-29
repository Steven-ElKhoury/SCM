import { Route, Routes } from 'react-router-dom'
import Main from './pages/Main';
import Suppliers from './pages/Suppliers';
import Login from './pages/Login'
import Register from './pages/Register'
import AcceptEmployee from './pages/AcceptEmployee';
import { useStateValue } from './Components/StateProvider';
import About from './pages/About';
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <div>
      <div className='container'>
        <Routes>
          <Route path='/*' element = {<LandingPage/>}></Route>
          <Route path='/main/*' element={<Main/>}></Route>
          {/* <Route path='/landingpage/*' element={<LandingPage/>}></Route> */}
          <Route path='/suppliers/' element={<Suppliers/>}></Route>
          {/* <Route path='/login/' element={<Login/>}></Route>
          <Route path='/register/' element={<Register/>}></Route>
          <Route path='/about/' element={<About/>}></Route> */}
          {/* <Route path='/acceptemployee/' element={<AcceptEmployee/>}></Route> */}
        </Routes>
      </div>
    </div>
  )
}

export default App