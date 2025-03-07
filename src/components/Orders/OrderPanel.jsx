import { useEffect, useState } from "react";
import "./orderPanel.css"

function OrderPanel() {
    const [orders, setOrders] = useState([]);
    const [showing,setShowing]= useState(null)
    const [orderShowing,setOrdershowing]=useState({})

    // Fetch orders and items when admin logs in
    useEffect( () => {

        
        fetch("http://localhost:5000/order/orders")
            .then(res => res.json())
            .then((data) => {setOrders(data);
                            let tempOrderShowing={}
                            data.forEach((element)=>{tempOrderShowing[element._id]=false});
                            setOrdershowing(tempOrderShowing);
            })
            .catch(err=>console.log(err));
        
    }, []);

    const showFullOrder=(id)=>{
        setOrdershowing((prev)=>({...prev,[id]:true }))
        setShowing(id)
        console.log(orderShowing)
    }

    const hideFullOrder=(id)=>{
        setOrdershowing((prev)=>({...prev,[id]:false }))
        setShowing(null)
    }

    return (
        <div className="admin-panel">

            {/* Orders Section */}
            <h3>Pending Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Show</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userId.username}</td>{/* Display user's name */}
                            <td>{order.status}</td>
                            {orderShowing[order._id]?((<td><button onClick={()=>{hideFullOrder(order._id)}}>hide</button></td>)):
                                                        (<td><button onClick={()=>{showFullOrder(order._id)}}>show</button></td>)}</tr>
                    ))}
                </tbody>

            </table>
        </div>
        
    );
}


export default OrderPanel;
