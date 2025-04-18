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
import StudentPanel from './components/Student/StudentPanel'
//import RemoveModal from './components/modals/removeModal'
import PrintJobsPanel from './components/PrintJobsPanel'
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
        {isLoggedIn && <Header />}
        <div className="content">
          <Routes>
            {/* Redirect to login if not logged in */}
            <Route path="completed" element={isLoggedIn ? <CompletedOrderPanel /> : <Navigate to="/" />} />
            <Route path="pending" element={isLoggedIn ? <PendingOrderPanel /> : <Navigate to="/" />} />
            <Route path="inventory" element={isLoggedIn ? <InventoryPanel /> : <Navigate to="/" />} />
            <Route path="students" element={isLoggedIn ? <StudentPanel /> : <Navigate to="/" />} />
            <Route path="print" element={isLoggedIn ? <PrintJobsPanel /> : <Navigate to="/" />} />
            
            <Route path="/" element={<LoginModal />} />
            <Route path="/*" element={<LoginModal />} />
          </Routes>
        </div>
        {isLoggedIn && <Footer />}
      </myContext.Provider>
    </div>
  );
}

export default App
