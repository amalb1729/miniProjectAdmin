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
                
                
                <div className="filter-section">
                    <div className="filter-title">
                        <span className="filter-icon">🔍</span>
                        Filter Orders
                    </div>
                    <div className="filter-controls">
                        {/* Department Dropdown */}
                        <div className="filter-group">
                            <label>Department</label>
                            <select 
                                value={filterSearch.department} 
                                onChange={(e) => setDepartment(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Departments</option>
                                <option value="CSE">Computer Science</option>
                                <option value="ECE">Electronics</option>
                                <option value="EEE">Electrical</option>
                                <option value="MECH">Mechanical</option>
                                <option value="CIVIL">Civil</option>
                            </select>
                        </div>

                        {/* Semester Dropdown */}
                        <div className="filter-group">
                            <label>Semester</label>
                            <select 
                                value={filterSearch.semester} 
                                onChange={(e) => setSemester(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Semesters</option>
                                {[...Array(8)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                ))}                       
                            </select>
                        </div>
                    </div>
                </div>
                
                
                
                <div className="section-header">
                    <h3 className="section-title">Pending Orders</h3>
                    <div className="order-count">{pendingOrders.length} orders</div>
                </div>
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        <div className="empty-state-content">
                                            <span className="empty-icon">📭</span>
                                            <p>No pending orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pendingOrders.map(order => (
                                    <tr key={order._id} className="order-row">
                                        <td className="user-name">
                                            <div className="user-info">
                                                <span className="user-icon">👤</span>
                                                {order.userId.username}
                                            </div>
                                        </td>
                                        <td className="department">{order.userId.department}</td>
                                        <td className="semester">Semester {order.userId.semester}</td>
                                        <td>
                                            <span className="status pending">{order.status}</span>
                                        </td>
                                        <td className="action-cell">
                                            <button 
                                                className="action-btn view-btn" 
                                                onClick={() => handleScanSuccess(order._id)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
