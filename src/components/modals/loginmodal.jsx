import { useContext, useRef, useState } from "react";
import Modal from "./modal";
import { myContext } from "../../App";
import "./log.css";
import { useNavigate } from "react-router-dom";

function LoginModal() {
    const { isLoginOpen, setLoginOpen,isLoggedIn,setLoggedIn} = useContext(myContext);
    const userRef = useRef(null);
    const passRef = useRef(null);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const navigate = useNavigate();

    const checkpw = async () => {
        const username = userRef.current.value.trim();
        const password = passRef.current.value.trim();
    
        // Regex for validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; 
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        // Validate username and password
        if (!usernameRegex.test(username)) {
            setMessage("❌ Invalid username! Use 3-20 characters (letters, numbers, _).");
            return;
        }
    
        if (!passwordRegex.test(password)) {
            setMessage("❌ Invalid password! Must be 8+ characters, contain a letter, number, and special character.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            console.log(data)
    
            if (response.ok && data.user.role=="admin") {
                setMessage("✅ Login Successful!");
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                
                setTimeout(() => {
                    setLoggedIn(true);
                    setLoginOpen(false);
                    setMessage(null);
                    navigate("/inventory");
                }, 2000);
            }

            else if(response.ok){
                setMessage("❌ " + "Admin privileges not found");
                userRef.current.value = "";
                passRef.current.value = "";

            } 
            
            else {
                setMessage("❌ " + data.message);
                userRef.current.value = "";
                passRef.current.value = "";
            }
        } catch (error) {
            setMessage("❌ Network error. Please try again.",error);
        }
    };
    

    return (
        <Modal isOpen={isLoginOpen} closeModal={() => { }}>
            <div className="modalContent">
                <h2>Login</h2>
                <input type="text" placeholder="Username" ref={userRef} />

                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        ref={passRef} 
                    />
                    <input 
                        type="checkbox" 
                        id="showPasswordLogin" 
                        checked={showPassword} 
                        onChange={() => setShowPassword(!showPassword)} 
                    />
                    <label htmlFor="showPasswordLogin">Show Password</label>
                </div>

                {message && <p className={message.includes("✅") ? "success" : "error"}>{message}</p>}
                
                <div className="options">
                    <button className="submit" onClick={checkpw}>Submit</button>
                </div>
            </div>
        </Modal>
    );
}

export default LoginModal;
