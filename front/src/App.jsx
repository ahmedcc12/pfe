import { useLocation } from 'react-router-dom'
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
import PersistLogin from './components/PersistLogin'
import Unauthorized from './components/Unauthorized'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

function App() {
  const location = useLocation(); // Get current location
  
  return (
    <div>
      
      <NavbarDefault />
        <Routes>
          
        <Route element={<PersistLogin/>} >

        <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
              <Route 
        path="/forgotpassword" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
                    <Route 
        path="/resetpassword/:token" 
        element={
            <ResetPassword />
        } 
      />

        <Route element={<RequireAuth allowedRoles={["user","admin"]}/>} >
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/Profile" element={<Profile />} /> */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/missing" element={<Missing />} />
          </Route>
        <Route element={<RequireAuth allowedRoles={["admin"]}/>} >
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/edit/:matricule" element={<Register />} />
       </Route>

       
        </Route> 

        <Route path="*" element={<Missing/>}/>
        </Routes>
        
  </div>

);
    
}

export default App
