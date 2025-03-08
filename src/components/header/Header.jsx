import { Navigate, NavLink } from 'react-router-dom';
import './header.css';
import { useContext, useState } from 'react';
import { myContext } from '../../App';
import  {useNavigate} from "react-router-dom"


function Header() {
    const {isLoggedIn,setLoggedIn,setLoginOpen}=useContext(myContext)
    const navigate=useNavigate();    
    return (
        <>
            <div className="head">
                <header>
                    <h1 className="logo">Store</h1>
    
                      <button type="button" className="accbtn login" onClick={() => {setLoggedIn(false);setLoginOpen(true);}}>Logout</button>
                


                </header>
                <hr />
                <nav>
                    <ul className="nav-list">
                        <li><NavLink to="/orders" className={({ isActive }) => isActive ? "act" : "inact"}>orders</NavLink></li>
                        <li><NavLink to="/inventory" className={({ isActive }) => isActive ? "act" : "inact"}>inventory</NavLink></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Header;
