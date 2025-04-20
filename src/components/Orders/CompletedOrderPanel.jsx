import { useEffect, useState, useContext } from "react";
import { myContext } from "../../App";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";

function CompletedOrderPanel() {
    const { accessToken, refreshRequest } = useContext(myContext);
    const [order,setOrder]=useState([]);
    const [pendingOrders,setPendingOrders]=useState([])
    const [completedOrders,setCompletedOrders]=useState([])
    const [statusModal,setStatusModal]=useState(false)
    const [newStatus,setNewStatus]=useState({}) // for storing id and stastus of order for changing status

    const [showing,setShowing]= useState(null) // currently showing order object in modal
    const [orderShowing,setOrdershowing]=useState({})
    const [currentlyShowingId,setCurrentlyShowingId]=useState(null)
    const [modalIsOpen,setModelIsOpen]=useState(false);


    const [filterSearch,setFilterSearch]=useState({department:"",semester:"",status:""})

    const setDepartment=(value)=>{
        console.log(value)
        setFilterSearch((prev)=>({...prev,"department":value,"hi":"hello"}))
    }
    const setSemester=(value)=>{
        setFilterSearch((prev)=>({...prev,"semester":value}))

    }
    useEffect(() => {
        let filteredOrders = [...order];

        // Apply department filter
        if (filterSearch.department) {
            filteredOrders = filteredOrders.filter(element => 
                element.userId.department === filterSearch.department
            );
        }

        // Apply semester filter
        if (filterSearch.semester) {
            filteredOrders = filteredOrders.filter(element => 
                element.userId.semester == filterSearch.semester
            );
        }

        // Apply status filter
        if (filterSearch.status) {
            filteredOrders = filteredOrders.filter(element => 
                element.status === filterSearch.status
            );
        }

        setCompletedOrders(filteredOrders);
    }, [filterSearch, order]);

    
    // Fetch orders and items when admin logs in
    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                let token = accessToken;
                if (!token) {
                    token = await refreshRequest();
                }
                
                let response = await fetch("/api/order/completedOrders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (response.status === 401) {                                       
                    token = await refreshRequest();
                    response = await fetch("/api/order/completedOrders", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });                   // Fetch orders and items when admin logs in
                }
                
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data)
                    setCompletedOrders(data);
                }
            } catch (error) {
                console.error("Error fetching completed orders:", error);
            }
        };
        
        fetchCompletedOrders();
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

    const changeStatusFn= async(id,status)=>{
        try{
                    let token = accessToken;
                    if (!token) {
                        token = await refreshRequest();
                    }
        
                    let response = await fetch("/api/order/orders/change", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ id, status }),
                    });
        
                    if (response.status === 401) {
                        token = await refreshRequest();
                        response = await fetch("/api/order/orders/change", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ id, status }),
                        });
                    }
    
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

                        {/* Status Dropdown */}
                        <div className="filter-group">
                            <label>Status</label>
                            <select 
                                value={filterSearch.status || ""} 
                                onChange={(e) => setFilterSearch(prev => ({ ...prev, status: e.target.value }))}
                                className="filter-select"
                            >
                                <option value="">All Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                

                
                <div className="section-header">
                    <h3 className="section-title">Completed/Cancelled Orders</h3>
                    <div className="order-count">{completedOrders.length} orders</div>
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
                            {completedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        <div className="empty-state-content">
                                            <span className="empty-icon">📭</span>
                                            <p>No orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                completedOrders.map(order => (
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
                                            <span className={`status ${order.status}`}>{order.status}</span>
                                        </td>
                                        <td className="action-cell">
                                            <button 
                                                className="action-btn view-btn" 
                                                onClick={() => {showFullOrder(order._id,order.status);editStatus(order._id,order.status)}}
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
        {modalIsOpen && showing ?(<OrderModal {...orderModalProps}/>):null}
        {/* {statusModal?<EditStatusModal {...statusModalProps}/>:null} */}
        </>
    );
}


export default CompletedOrderPanel;
