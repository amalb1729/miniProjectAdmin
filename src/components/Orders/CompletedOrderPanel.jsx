import { useEffect, useState } from "react";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";

function CompletedOrderPanel() {
    const [order,setOrder]=useState([]);
    const [pendingOrders,setPendingOrders]=useState([])
    const [completedOrders,setCompletedOrders]=useState([])
    const [statusModal,setStatusModal]=useState(false)
    const [newStatus,setNewStatus]=useState({}) // for storing id and stastus of order for changing status

    const [showing,setShowing]= useState(null) // currently showing order object in modal
    const [orderShowing,setOrdershowing]=useState({})
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);


    const [filterSearch,setFilterSearch]=useState({department:"",semester:""})

    const setDepartment=(value)=>{
        console.log(value)
        setFilterSearch((prev)=>({...prev,"department":value,"hi":"hello"}))
    }
    const setSemester=(value)=>{
        setFilterSearch((prev)=>({...prev,"semester":value}))

    }
     useEffect(()=>{
            if(filterSearch.department=="" && filterSearch.semester==""){
                    setCompletedOrders([...order])
            }
            else if(filterSearch.department=="" )
                    setCompletedOrders([...order.filter((element)=>(element.userId.semester==filterSearch.semester))])
            else if(filterSearch.semester=="")
                    setCompletedOrders([...order.filter((element)=>(element.userId.department==filterSearch.department))])
            else    
                 setCompletedOrders([...order.filter((element)=>(element.userId.department==filterSearch.department && element.userId.semester==filterSearch.semester))]) 
    
            console.log(filterSearch)
        },[filterSearch])

    
    // Fetch orders and items when admin logs in
    useEffect( () => {
        fetch("/api/order/completedOrders")
            .then(res => res.json())
            .then((data) => {
                            setOrder(data)
                            setCompletedOrders(data);
            })
            .catch(err=>console.log(err));
        
    }, []);


    useEffect(()=>{
        if(showing){
            setModelIsOpen(true)
        }

    },[showing])


    const showFullOrder=(id,status)=>{
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

    const changeStatusFn= async(id,status,prevStatus)=>{
        try{

            const response = await fetch("/api/order/orders/change", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id,status }),
            });
    
            const data = await response.json();
            console.log(data)

            if(status!="Pending")
                setCompletedOrders((prev)=>(prev.map((element)=>(element._id!=id?(element):{...element,status}))))
            else
                setCompletedOrders((prev)=>(prev.filter((element)=>(element._id!=id))))
                

            
        

        }catch(error){
            console.log(error)
        }
        setNewStatus({})
    }

    

    const orderModalProps={modalIsOpen,setModelIsOpen,showing,hideFullOrder,statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}
    // const statusModalProps={statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}

    return (
        <>
        <div className="admin-panel">
            <div className="order-section">
                
            <div className="filter">
                    {/* Department Dropdown */}
                    <select value={filterSearch.department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Select Department</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ECE">Electronics</option>
                            <option value="EEE">Electrical</option>
                            <option value="MECH">Mechanical</option>
                            <option value="CIVIL">Civil</option>
                        </select>

                        {/* Semester Dropdown */}
                        <select value={filterSearch.semester} onChange={(e) => setSemester(e.target.value)}>
                            <option value="">Select Semester</option>
                            {[...Array(8)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}                       
                        </select>
                </div>
                
                

                
                <h3 className="section-title">Completed/Cancelled Orders</h3>
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                {/* <th>Order ID</th> */}
                                <th>User</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedOrders.map(order => (
                                <tr key={order._id} className="order-row">
                                    {/* <td className="order-id">{order._id}</td> */}
                                    <td className="user-name">{order.userId.username}</td>
                                    <td>
                                        <span className={`status ${order.status}`}>{order.status}</span>
                                    </td>
                                    <td className="action-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            onClick={()=>{showFullOrder(order._id,order.status);editStatus(order._id,order.status)}}>
                                            View Details
                                        </button>
                                        {/* <button 
                                            className="action-btn edit-btn" 
                                            onClick={()=>{editStatus(order._id,order.status)}}>
                                            Edit Status
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {modalIsOpen && showing ?(<OrderModal {...orderModalProps}/>):null}
        {/* {statusModal?<EditStatusModal {...statusModalProps}/>:null} */}
        </>
    );
}


export default CompletedOrderPanel;
