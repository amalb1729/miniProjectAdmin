import { useEffect, useState } from "react";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";
import QrScanner from "./QRscanner";
function PendingOrderPanel() {

    const [order,setOrder]=useState([]);
    const [pendingOrders,setPendingOrders]=useState([])
    const [statusModal,setStatusModal]=useState(false)
    const [newStatus,setNewStatus]=useState({}) // for storing id and stastus of order for changing status

    const [showing,setShowing]= useState(null) // currently showing order object in modal
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);

    const [filterSearch,setFilterSearch]=useState({department:"",semester:""})
    const [result,setResult]=useState("")
    const [qrKey,setQrKey]=useState(Date.now())

    const handleScanSuccess = (id) => {
        showFullOrder(id,"Pending");
        editStatus(id,"Pending");
        console.log(id,"Pending","from scan")

        // showFullOrder(order._id,order.status);
        // editStatus(order._id,order.status)
    };

    const setDepartment=(value)=>{
        console.log(value)
        setFilterSearch((prev)=>({...prev,"department":value,"hi":"hello"}))
    }
    const setSemester=(value)=>{
        setFilterSearch((prev)=>({...prev,"semester":value}))

    }

    useEffect(()=>{
        if(filterSearch.department=="" && filterSearch.semester==""){
                setPendingOrders([...order])
        }
        else if(filterSearch.department=="" )
                setPendingOrders([...order.filter((element)=>(element.userId.semester==filterSearch.semester))])
        else if(filterSearch.semester=="")
                setPendingOrders([...order.filter((element)=>(element.userId.department==filterSearch.department))])
        else    
             setPendingOrders([...order.filter((element)=>(element.userId.department==filterSearch.department && element.userId.semester==filterSearch.semester))]) 

        console.log(filterSearch)
    },[filterSearch])

    
    // Fetch orders and items when admin logs in
    useEffect( () => {
        fetch("/api/order/pendingOrders")
            .then(res => res.json())
            .then((data) => {
                            console.log(data)
                            setOrder(data)
                            setPendingOrders(data);
            })
            .catch(err=>console.log(err));
        
    }, []);


    // useEffect(()=>{
    //     if(showing){
    //         setModelIsOpen(true)
    //     }

    // },[showing])
    useEffect(()=>{
        setQrKey(Date.now())
    },[pendingOrders])

    const showFullOrder=(id,status)=>{
            setShowing(order.find((element)=>(element._id==id)))  
            console.log("pending order:",order)
            console.log("setshowing inside value",order.find((element)=>{console.log(element._id,id,"inside find");return element._id==id}))
            setModelIsOpen(true)
            setCurrentlyShowingId(id)   
            console.log("called showfullorder")
        }

    const hideFullOrder=()=>{
            setShowing(null)  
            setCurrentlyShowingId(null)   
            }

    
    const editStatus= (id,status)=>{
        setNewStatus((prev)=>({...prev,["id"]:id,["status"]:status}))
        setStatusModal(true)
        console.log("called editstatus")
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
                setOrder((prev)=>(prev.map((element)=>(element._id!=id?(element):{...element,status}))))
            else
                setOrder((prev)=>(prev.filter((element)=>(element._id!=id))))
            
        

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
            <div>
            <h2>QR Code Scanner</h2>
        {(!statusModal && !modalIsOpen && order.length>=1) ? <QrScanner key={qrKey} onScanSuccess={handleScanSuccess}/>:null}</div>
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
                
                
                
                <h3 className="section-title">Pending Orders</h3>
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
                            {pendingOrders.map(order => (
                                <tr key={order._id} className="order-row">
                                    {/* <td className="order-id">{order._id}</td> */}
                                    <td className="user-name">{order.userId.username}</td>
                                    <td>
                                        <span className="status pending">{order.status}</span>
                                    </td>
                                    <td className="action-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            onClick={()=>{handleScanSuccess(order._id)}}>
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
        {(modalIsOpen && showing) ?(<OrderModal {...orderModalProps}/>):null}
        {/* {statusModal?<EditStatusModal {...statusModalProps}/>:null} */}
        </>
    );
}


export default PendingOrderPanel;
