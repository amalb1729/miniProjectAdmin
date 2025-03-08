import { useState } from 'react'
import './App.css'
import Header from "./components/header/Header"
import Footer from './components/footer/Footer'
import OrderPanel from "./components/Orders/OrderPanel"
import InventoryPanel from "./components/Inventory/InvertoryPanel"
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import { createContext } from 'react'
import LoginModal from './components/modals/loginmodal'
//import RemoveModal from './components/modals/removeModal'

export const myContext=createContext();

function App() {

  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isLoggedIn,setLoggedIn]=useState(false)
  const loginProp={ isLoginOpen, setLoginOpen,isLoggedIn,setLoggedIn}


    return (
  <div className="app">
    <myContext.Provider value={{ isLoginOpen, setLoginOpen, isLoggedIn, setLoggedIn }}>
      <Header />
      <div className="content">
        <Routes>
          {/* Redirect to login if not logged in */}
          <Route path="orders" element={isLoggedIn ? <OrderPanel /> : <Navigate to="/" />} />
          <Route path="inventory" element={isLoggedIn ? <InventoryPanel /> : <Navigate to="/" />} />
          <Route path="/" element={<LoginModal />} />
        </Routes>
      </div>
      <Footer />
    </myContext.Provider>
  </div>
);
}

export default App
