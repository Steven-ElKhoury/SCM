import { Route, Routes } from 'react-router-dom'
import Main from './pages/Main'

import Suppliers from './pages/Suppliers';
import Login from './pages/Login'
import Register from './pages/Register'
import AcceptEmployee from './pages/AcceptEmployee';


function App() {
  return (
    <div>
      <div className='container'>
        <Routes>
          <Route path='/' element = {<Login/>}></Route>
          <Route path='/main/*' element={<Main/>}></Route>
          <Route path='/suppliers/' element={<Suppliers/>}></Route>
          <Route path='/login/' element={<Login/>}></Route>
          <Route path='/register/' element={<Register/>}></Route>
          {/* <Route path='/acceptemployee/' element={<AcceptEmployee/>}></Route> */}
        </Routes>
      </div>
    </div>
  )
}

export default App
