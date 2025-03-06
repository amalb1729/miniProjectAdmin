import { useState } from 'react'
import './App.css'
import Header from "./components/header/Header"
import Footer from './components/footer/Footer'
import OrderPanel from "./components/Orders/OrderPanel"
import InventoryPanel from "./components/Inventory/InvertoryPanel"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext } from 'react'
import LoginModal from './components/modals/loginmodal'
//import RemoveModal from './components/modals/removeModal'

export const myContext=createContext();

function App() {

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn,setLoggedIn]=useState(false)

  return (
    <>
    <div className='app'>
      <myContext.Provider value={{isLoginOpen, setLoginOpen,isLoggedIn,setLoggedIn}}>

      <Header/>
        <div className='content'>
            <Routes>
              <Route path="orders" element={<OrderPanel/>}/>
              <Route path="inventory" element={<InventoryPanel/>}/>
            </Routes>
        </div>
      <Footer/>
      <LoginModal/>
      </myContext.Provider>
    </div>
    </>
  )
}

export default App
