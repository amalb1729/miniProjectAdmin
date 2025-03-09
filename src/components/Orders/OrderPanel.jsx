import { useEffect, useState } from "react";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";

function OrderPanel() {
    const [orders, setOrders] = useState([]);
    const [pendingOrders,setPendingOrders]=useState([])
    const [completedOrders,setCompletedOrders]=useState([])
    const [statusModal,setStatusModal]=useState(false)
    const [newStatus,setNewStatus]=useState({}) // for storing id and stastus of order for changing status

    const [showing,setShowing]= useState(null) // currently showing order object in modal
    const [orderShowing,setOrdershowing]=useState({})
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);

    // Fetch orders and items when admin logs in
    useEffect( () => {
        fetch("http://localhost:5000/order/orders")
            .then(res => res.json())
            .then((data) => {
                            console.log(data)
                            setPendingOrders(data.pendingOrders);
                            setCompletedOrders(data.completedOrders);
                            //let tempOrderShowing={}
                            //data.forEach((element)=>{tempOrderShowing[element._id]=false});
                            //setOrdershowing(tempOrderShowing);
            })
            .catch(err=>console.log(err));
        
    }, []);


    useEffect(()=>{
        if(showing){
            setModelIsOpen(true)
        }

    },[showing])


    const showFullOrder=(id,status)=>{
        if(status=="Pending")
            setShowing(pendingOrders.find((element)=>(element._id==id)))  
        else
            setShowing(completedOrders.find((element)=>(element._id==id))) 
        setCurrentlyShowingId(id)   
        }

    const hideFullOrder=()=>{
            setShowing(null)  
            setCurrentlyShowingId(null)   
            }

    
    const editStatus= (id,status)=>{
        setNewStatus((prev)=>({...prev,["id"]:id,["status"]:status}))
        setStatusModal(true)
        console.log(id)
    }

    const changeStatusFn= async(id,status)=>{
        try{

            const response = await fetch("http://localhost:5000/order/orders/change", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id,status }),
            });
    
            const data = await response.json();
            console.log(data)

        }catch(error){
            console.log(error)
        }
        setNewStatus({})
    }

    

    const orderModalProps={modalIsOpen,setModelIsOpen,showing,hideFullOrder}
    const statusModalProps={statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}

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
                    {pendingOrders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userId.username}</td>{/* Display user's name */}
                            <td>{order.status}</td>
                            <td><button onClick={()=>{showFullOrder(order._id,order.status)}}>show</button>
                                  <button onClick={()=>{editStatus(order._id,order.status)}}>edit</button></td></tr>
                    ))}
                </tbody>
            </table>

            <h3>Completed Orders</h3>
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
                    {completedOrders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userId.username}</td>{/* Display user's name */}
                            <td>{order.status}</td>
                            <td><button onClick={()=>{showFullOrder(order._id,order.status)}}>show</button>
                                <button onClick={()=>{editStatus(order._id,order.status)}}>edit</button></td></tr>
                    ))}
                </tbody>
            </table>


        </div>
        {modalIsOpen && showing ?(<OrderModal {...orderModalProps}/>):null}
        {statusModal?<EditStatusModal {...statusModalProps}/>:null}
        </>
    );
}


export default OrderPanel;
