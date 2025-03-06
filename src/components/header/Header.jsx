import { NavLink } from 'react-router-dom';
import './header.css';
import { useContext, useState } from 'react';
import { myContext } from '../../App';


function Header() {
    const {isLoggedIn,setLoggedIn,setLoginOpen}=useContext(myContext)
    
    return (
        <>
            <div className="head">
                <header>
                    <h1 className="logo">Store</h1>
                    {!isLoggedIn && 
                        (<div className="account">
                            <button type="button" className="accbtn login" onClick={() => setLoginOpen(true)} >Login</button>
                        </div>)
                    }

                    {
                      isLoggedIn &&(<button type="button" className="accbtn login" onClick={() => setLoggedIn(false)} >Logout</button>)
                    }


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
