import { useEffect, useState } from "react";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";

function PendingOrderPanel() {
    const [pendingOrders,setPendingOrders]=useState([])
    const [statusModal,setStatusModal]=useState(false)
    const [newStatus,setNewStatus]=useState({}) // for storing id and stastus of order for changing status

    const [showing,setShowing]= useState(null) // currently showing order object in modal
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);

    // Fetch orders and items when admin logs in
    useEffect( () => {
        fetch("/api/order/pendingOrders")
            .then(res => res.json())
            .then((data) => {
                            setPendingOrders(data);
            })
            .catch(err=>console.log(err));
        
    }, []);


    useEffect(()=>{
        if(showing){
            setModelIsOpen(true)
        }

    },[showing])


    const showFullOrder=(id,status)=>{
            setShowing(pendingOrders.find((element)=>(element._id==id)))  
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

    const changeStatusFn= async(id,status,prevStatus)=>{
        try{

            const response = await fetch("/api/order/orders/change", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id,status }),
            });
    
            const data = await response.json();
            console.log(data)

            if(status=="Pending")
                setPendingOrders((prev)=>(prev.map((element)=>(element._id!=id?(element):{...element,status}))))
            else
                setPendingOrders((prev)=>(prev.filter((element)=>(element._id!=id))))
            
        

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
            <div className="order-section">
                <h3 className="section-title">Pending Orders</h3>
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOrders.map(order => (
                                <tr key={order._id} className="order-row">
                                    <td className="order-id">{order._id}</td>
                                    <td className="user-name">{order.userId.username}</td>
                                    <td>
                                        <span className="status pending">{order.status}</span>
                                    </td>
                                    <td className="action-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            onClick={()=>{showFullOrder(order._id,order.status)}}>
                                            View Details
                                        </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            onClick={()=>{editStatus(order._id,order.status)}}>
                                            Edit Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {modalIsOpen && showing ?(<OrderModal {...orderModalProps}/>):null}
        {statusModal?<EditStatusModal {...statusModalProps}/>:null}
        </>
    );
}


export default PendingOrderPanel;
