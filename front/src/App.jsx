import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar, { NavbarDefault } from './components/navbar'
import Login from './pages/login'
import Register from './pages/register'
import Homepage from './pages/homepage'
import Missing from './components/missing'
import Admin from './pages/admin'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import RequireAuth from './components/RequireAuth'
import PublicRoute from './components/publicRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      
        <NavbarDefault />
        <Routes>
          
        <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
        <Route element={<RequireAuth allowedRoles={["user","admin"]}/>} >
          <Route path="/" element={<Homepage />} />
          </Route>
        <Route element={<RequireAuth allowedRoles={["admin"]}/>} >
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/register" element={<Register />} />
        </Route>

        <Route path="*" element={<Missing/>}/>
        </Routes>
        
  </div>

);
    
}

export default App
