import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar, { NavbarDefault } from './components/navbar'
import Login from './components/login'
import Register from './components/register'
import Homepage from './components/homepage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <NavbarDefault />
    <Homepage />
  </div>

);
    
}

export default App
