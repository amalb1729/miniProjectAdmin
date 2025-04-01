import { useState } from 'react'
import './App.css'
import Header from "./components/header/Header"
import Footer from './components/footer/Footer'
import PendingOrderPanel from "./components/Orders/PendingOrderPanel"
import CompletedOrderPanel from "./components/Orders/CompletedOrderPanel"
import InventoryPanel from "./components/Inventory/InvertoryPanel"
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import { createContext } from 'react'
import LoginModal from './components/modals/loginmodal'
//import RemoveModal from './components/modals/removeModal'

export const myContext=createContext();

function App() {
  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(() => {
    // Check sessionStorage for login state
    const loginState = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    // Only show login modal if not logged in
    if (loginState) setLoginOpen(false);
    return loginState;
  });
  
  const loginProp={ isLoginOpen, setLoginOpen,isLoggedIn,setLoggedIn}

  return (
    <div className="app">
      <myContext.Provider value={{ isLoginOpen, setLoginOpen, isLoggedIn, setLoggedIn }}>
        <Header />
        <div className="content">
          <Routes>
            {/* Redirect to login if not logged in */}
            <Route path="completed" element={isLoggedIn ? <CompletedOrderPanel /> : <Navigate to="/" />} />
            <Route path="pending" element={isLoggedIn ? <PendingOrderPanel /> : <Navigate to="/" />} />
            <Route path="inventory" element={isLoggedIn ? <InventoryPanel /> : <Navigate to="/" />} />
            <Route path="/" element={<LoginModal />} />
            <Route path="/*" element={<LoginModal />} />
          </Routes>
        </div>
        <Footer />
      </myContext.Provider>
    </div>
  );
}

export default App
