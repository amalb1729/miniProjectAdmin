import { useEffect, useState, useContext } from "react";
import { myContext } from "../../App";
import "./orderPanel.css"
import OrderModal from "../modals/orderModal";
import EditStatusModal from "../modals/editStatusModal";
import QrScanner from "./QRscanner";
function PendingOrderPanel() {

    const { accessToken, refreshRequest } = useContext(myContext);
    const [order, setOrder] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([])
    const [statusModal, setStatusModal] = useState(false)
    const [newStatus, setNewStatus] = useState({}) // for storing id and stastus of order for changing status

    const [showing, setShowing] = useState(null) // currently showing order object in modal
    const [currentlyShowingId, setCurrentlyShowingId] = useState(null)
    const [modalIsOpen, setModelIsOpen] = useState(false);

    const [filterSearch, setFilterSearch] = useState({ department: "", semester: "" })
    const [result, setResult] = useState("")
    const [qrKey, setQrKey] = useState(Date.now())
    const [cancellingAll, setCancellingAll] = useState(false)
    const [cancelResult, setCancelResult] = useState(null)

    const handleScanSuccess = (id) => {
        showFullOrder(id, "Pending");
        editStatus(id, "Pending");
        console.log(id, "Pending", "from scan")

        // showFullOrder(order._id,order.status);
        // editStatus(order._id,order.status)
    };

    const setDepartment = (value) => {
        console.log(value)
        setFilterSearch((prev) => ({ ...prev, "department": value, "hi": "hello" }))
    }
    const setSemester = (value) => {
        setFilterSearch((prev) => ({ ...prev, "semester": value }))

    }

    useEffect(() => {
        if (filterSearch.department == "" && filterSearch.semester == "") {
            setPendingOrders([...order])
        }
        else if (filterSearch.department == "")
            setPendingOrders([...order.filter((element) => (element.userId.semester == filterSearch.semester))])
        else if (filterSearch.semester == "")
            setPendingOrders([...order.filter((element) => (element.userId.department == filterSearch.department))])
        else
            setPendingOrders([...order.filter((element) => (element.userId.department == filterSearch.department && element.userId.semester == filterSearch.semester))])

        console.log(filterSearch)
    }, [filterSearch])

    // Fetch orders and items when admin logs in
    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                let token = accessToken;
                if (!token) {
                    token = await refreshRequest();
                }

                let response = await fetch("/api/order/pendingOrders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.status === 401) {
                    token = await refreshRequest();
                    response = await fetch("/api/order/pendingOrders", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                }

                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                    setPendingOrders(data);
                }
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            }
        };

        fetchPendingOrders();
    }, []);

    useEffect(() => {
        setQrKey(Date.now())
    }, [pendingOrders])

    const showFullOrder = (id, status) => {
        setShowing(order.find((element) => (element._id == id)))
        console.log("pending order:", order)
        console.log("setshowing inside value", order.find((element) => { console.log(element._id, id, "inside find"); return element._id == id }))
        setModelIsOpen(true)
        setCurrentlyShowingId(id)
        console.log("called showfullorder")
    }

    const hideFullOrder = () => {
        setShowing(null)
        setCurrentlyShowingId(null)
    }

    const editStatus = (id, status) => {
        setNewStatus((prev) => ({ ...prev, ["id"]: id, ["status"]: status }))
        setStatusModal(true)
        console.log("called editstatus")
    }

    const changeStatusFn = async (id, status) => {
        try {
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
            console.log(data);

            if (status !== "Pending") {
                setOrder(prev => prev.filter(element => element._id !== id));
                setPendingOrders(prev => prev.filter(element => element._id !== id));
            } else {
                setOrder(prev => prev.map(element =>
                    element._id !== id ? element : { ...element, status }
                ));
                setPendingOrders(prev => prev.map(element =>
                    element._id !== id ? element : { ...element, status }
                ));
            }

        } catch (error) {
            console.log(error);
        }
        setNewStatus({});
    };

    // Function to cancel all pending orders
    const cancelAllPendingOrders = async () => {
        if (!window.confirm("Are you sure you want to cancel ALL pending orders? This will return all items to stock and cannot be undone.")) {
            return;
        }
        
        setCancellingAll(true);
        try {
            let token = accessToken;
            if (!token) {
                token = await refreshRequest();
            }

            let response = await fetch("/api/order/cancel-all-pending", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                token = await refreshRequest();
                response = await fetch("/api/order/cancel-all-pending", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
            }

            const data = await response.json();
            setCancelResult(data);
            
            // Refresh the orders list after cancellation
            if (response.ok) {
                setOrder([]);
                setPendingOrders([]);
                setTimeout(() => {
                    setCancelResult(null);
                }, 5000);
            }
        } catch (error) {
            console.error("Error cancelling all orders:", error);
            setCancelResult({ error: "Failed to cancel orders. Please try again." });
        } finally {
            setCancellingAll(false);
        }
    };

    const orderModalProps = { modalIsOpen, setModelIsOpen, showing, hideFullOrder, statusModal, setStatusModal, newStatus, setNewStatus, changeStatusFn }
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
                    {pendingOrders.length > 0 && (
                        <button 
                            className="cancel-all-btn" 
                            onClick={cancelAllPendingOrders}
                            disabled={cancellingAll}
                        >
                            {cancellingAll ? "Cancelling..." : "Cancel All Pending Orders"}
                        </button>
                    )}
                </div>
                
                {cancelResult && (
                    <div className={`cancel-result ${cancelResult.error ? 'error' : 'success'}`}>
                        {cancelResult.error || cancelResult.message}
                    </div>
                )}
                
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Ordered At</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="empty-state">
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
                                        <td>{new Date(order.orderedAt).toLocaleString()}</td>
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
