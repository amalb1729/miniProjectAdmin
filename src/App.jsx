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
import AnnouncementsPanel from './components/Announcements/AnnouncementsPanel'
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
  
  const [accessToken,setAccessToken] =useState("");

  const refreshRequest = async () => {
    const res = await fetch("/api/auth/token", {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Session expired");
    }

    const data = await res.json();
    // Ensure accessToken is always a string
    const tokenString = typeof data.accessToken === 'string' ? data.accessToken : String(data.accessToken);
    setAccessToken(tokenString);
    return tokenString;
  };

  const loginProp={ isLoginOpen, setLoginOpen,isLoggedIn,setLoggedIn}

  return (
    <div className="app">
      <myContext.Provider value={{ isLoginOpen, setLoginOpen, isLoggedIn, setLoggedIn,accessToken,setAccessToken,refreshRequest }}>
        {isLoggedIn && <Header />}
        <div className="content">
          <Routes>
            {/* Redirect to login if not logged in */}
            <Route path="completed" element={isLoggedIn ? <CompletedOrderPanel /> : <Navigate to="/" />} />
            <Route path="pending" element={isLoggedIn ? <PendingOrderPanel /> : <Navigate to="/" />} />
            <Route path="inventory" element={isLoggedIn ? <InventoryPanel /> : <Navigate to="/" />} />
            <Route path="students" element={isLoggedIn ? <StudentPanel /> : <Navigate to="/" />} />
            <Route path="announcements" element={isLoggedIn ? <AnnouncementsPanel /> : <Navigate to="/" />} />
            <Route path="/" element={isLoggedIn ? <PendingOrderPanel /> : <LoginModal />} />
            <Route path="/*" element={isLoggedIn ? <PendingOrderPanel /> : <LoginModal />} />
          </Routes>
        </div>
        {isLoggedIn && <Footer />}
      </myContext.Provider>
    </div>
  );
}

export default App
