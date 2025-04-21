import { Navigate, NavLink } from 'react-router-dom';
import './header.css';
import { useContext, useState } from 'react';
import { myContext } from '../../App';
import  {useNavigate} from "react-router-dom"


function Header() {
    const {isLoggedIn,setLoggedIn,setLoginOpen}=useContext(myContext)
    const navigate=useNavigate();    

    const handleLogout = async () => {
        try {
            // Call the server's logout endpoint to clear the HTTP-only refreshToken cookie
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include' // Important for cookies
            });
            
            if (response.ok) {
                // Clear local storage/session storage
                sessionStorage.removeItem('isAdminLoggedIn');
                // Update state
                setLoggedIn(false);
                setLoginOpen(true);
                console.log('Logged out successfully');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <div className="head">
                <header>
                    <h1 className="logo">Store</h1>
    
                      {isLoggedIn && <button type="button" className="accbtn login" onClick={handleLogout}>Logout</button>}
                </header>
                <hr />
                <nav>
                    <ul className="nav-list">
                        <li><NavLink to="/completed" className={({ isActive }) => isActive ? "act" : "inact"}>Completed</NavLink></li>
                        <li><NavLink to="/pending" className={({ isActive }) => isActive ? "act" : "inact"}>Pending</NavLink></li>
                        <li><NavLink to="/inventory" className={({ isActive }) => isActive ? "act" : "inact"}>Inventory</NavLink></li>
                        <li><NavLink to="/students" className={({ isActive }) => isActive ? "act" : "inact"}>Student</NavLink></li>
                        <li><NavLink to="/announcements" className={({ isActive }) => isActive ? "act" : "inact"}>Announcements</NavLink></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Header;
