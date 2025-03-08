import { useEffect, useState } from "react";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";

function OrderPanel() {
    const [orders, setOrders] = useState([]);
    const [showing,setShowing]= useState(null)
    const [orderShowing,setOrdershowing]=useState({})
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);

    // Fetch orders and items when admin logs in
    useEffect( () => {

        fetch("http://localhost:5000/order/orders")
            .then(res => res.json())
            .then((data) => {setOrders(data);
                            console.log(data)
                            let tempOrderShowing={}
                            data.forEach((element)=>{tempOrderShowing[element._id]=false});
                            setOrdershowing(tempOrderShowing);
            })
            .catch(err=>console.log(err));
        
    }, []);


    useEffect(()=>{
        if(showing){
            console.log(showing)
            setModelIsOpen(true)
            showing.orderedItems.forEach((order)=>{
            
                     console.log(order._id,order.itemId?_id:"item id not found",order.itemId?.name:"itemname not found",order.itemId?.price:"item price not found")
            
            })
        }

    },[showing])


    const showFullOrder=(id)=>{
        setOrdershowing((prev)=>({...prev,[id]:true }))
        setShowing(orders.find((element)=>(element._id==id)))  
        setCurrentlyShowingId(id)   
        }
    const hideFullOrder=()=>{
            setOrdershowing((prev)=>({...prev,[currentlyShowingId]:false }))
            setShowing(null)  
            setCurrentlyShowingId(null)   
            }

    

    const orderModalProps={modalIsOpen,setModelIsOpen,showing,hideFullOrder}

    return (
        <>
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
                            <td><button onClick={()=>{showFullOrder(order._id)}}>show</button></td></tr>
                    ))}
                </tbody>
            </table>
        </div>
        {modalIsOpen && showing ?(<OrderModal {...orderModalProps}/>):null}
        </>
    );
}


export default OrderPanel;
