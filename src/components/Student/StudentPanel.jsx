import { useEffect, useState, useContext } from "react";
import { myContext } from "../../App";
import "./StudentPanel.css"
import { IKImage } from 'imagekitio-react';
import OrderHistoryTable from "../Orders/OrderHistoryTable";
import FullOrderModal from "../modals/FullOrderModal";

function StudentPanel(){
    
    const { accessToken, refreshRequest } = useContext(myContext);
    const [students,setStudents]=useState([]);
    const [filteredStudents,setFilteredStudents]=useState([])

    // For viewing student activity
    const [activityModalOpen, setActivityModalOpen] = useState(false);
    const [activityStudent, setActivityStudent] = useState(null); // student object
    const [activityOrders, setActivityOrders] = useState({pending: [], completed: []});
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityError, setActivityError] = useState("");
    // For showing full order
    const [fullOrderModal, setFullOrderModal] = useState(false);
    const [fullOrder, setFullOrder] = useState(null);

    const handleViewActivity = async (student) => {
        setActivityStudent(student);
        setActivityLoading(true);
        setActivityError("");
        setActivityOrders({pending: [], completed: []});
        setActivityModalOpen(true);
        try {
            let token = accessToken;
            if (!token) {
                token = await refreshRequest();
            }
            
            let response = await fetch(`/api/order/orders/${student._id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.status === 401) {                                       
                token = await refreshRequest();
                response = await fetch(`/api/order/orders/${student._id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });                  
            }
            
            if (response.ok) {
                const data = await response.json();
                setActivityOrders({
                    pending: data.pendingOrders || [],
                    completed: data.completedOrders || []
                });
            }
        } catch (err) {
            setActivityError("Failed to fetch orders.");
        } finally {
            setActivityLoading(false);
        }
    }

    // Handler for 'Show' button in order table
    const handleShowOrder = (orderId, status) => {
        // Search both pending and completed arrays
        let order = null;
        if (status === "Pending") {
            order = activityOrders.pending.find(o => o._id === orderId);
        } else {
            order = activityOrders.completed.find(o => o._id === orderId);
        }
        setFullOrder(order);
        setFullOrderModal(true);
    }

    useEffect(()=>{
        const fetchStudents = async () => {
            try {
                let token = accessToken;
                if (!token) {
                    token = await refreshRequest();
                }
                
                let response = await fetch("/api/student/all", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (response.status === 401) {                                       
                    token = await refreshRequest();
                    response = await fetch("/api/student/all", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });                  
                }
                
                if (response.ok) {
                    const data = await response.json();
                    setFilteredStudents(data);
                    setStudents(data);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        
        fetchStudents();
    },[])

    const [filterSearch,setFilterSearch]=useState({name:"",department:"",semester:""})

    const setDepartment=(value)=>{
        console.log(value)
        setFilterSearch((prev)=>({...prev,"department":value,"hi":"hello"}))
    }
    const setSemester=(value)=>{
        setFilterSearch((prev)=>({...prev,"semester":value}))

    }
    const setQuery=(value)=>{
        setFilterSearch((prev)=>({...prev,"name":value}))

    }

    useEffect(()=>{

        if (filterSearch.name.trim()!=""){
            if(filterSearch.department=="" && filterSearch.semester==""){
                    setFilteredStudents([...students.filter((student)=>student.name.toLowerCase().includes(filterSearch.name.toLowerCase()))])
            }
            else if(filterSearch.department=="" )
                    setFilteredStudents([...students.filter((element)=>(element.semester==filterSearch.semester && element.name.toLowerCase().includes(filterSearch.name.toLowerCase())))])
            else if(filterSearch.semester=="")
                    setFilteredStudents([...students.filter((element)=>(element.department==filterSearch.department && element.name.toLowerCase().includes(filterSearch.name.toLowerCase())))])
            else    
                setFilteredStudents([...students.filter((element)=>(element.department==filterSearch.department && element.semester==filterSearch.semester && element.name.toLowerCase().includes(filterSearch.name.toLowerCase())))]) 
            }
        else {
            if(filterSearch.department=="" && filterSearch.semester==""){
                    setFilteredStudents([...students])
            }
            else if(filterSearch.department=="" )
                    setFilteredStudents([...students.filter((element)=>(element.semester==filterSearch.semester))])
            else if(filterSearch.semester=="")
                    setFilteredStudents([...students.filter((element)=>(element.department==filterSearch.department))])
            else    
                setFilteredStudents([...students.filter((element)=>(element.department==filterSearch.department && element.semester==filterSearch.semester))]) 
            }


            
        console.log(filterSearch)
    },[filterSearch])


      return (
             <div className="student-page">
                    <div className="section-header">
                        <h2 className="section-title">Student List</h2>
                        <div className="student-count">{filteredStudents.length} students</div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-title">
                            <span className="filter-icon">🔍</span>
                            Filter Students
                        </div>
                        <div className="filter-controls">
                            <div className="filter-group search-box">
                                <label>Search</label>
                                <div className="search-input-wrapper">
                                    <input 
                                        type="text" 
                                        value={filterSearch.name} 
                                        onChange={(e) => setQuery(e.target.value)} 
                                        placeholder="   Search by name..."
                                        className="search-input"
                                    />
                                </div>
                            </div>

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
    
                    <div className="table-container">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Department</th>
                                    <th>Semester</th>
                                    <th>Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-state">
                                            <div className="empty-state-content">
                                                <span className="empty-icon">👥</span>
                                                <p>No students found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map(student => (
                                        <tr key={student._id}>
                                            <td>
                                                <div className="student-info">
                                                    <IKImage
                                                        path={student.pictureURL}
                                                        urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                                                        transformation={[{
                                                            height: 40,
                                                            width: 40
                                                        }]}
                                                        className="student-avatar"
                                                        onError={(e) => (e.target.src = "https://placehold.co/40")} 
                                                        alt={student.name}
                                                    />
                                                    <span className="student-name">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="department">{student.department}</td>
                                            <td className="semester">Semester {student.semester}</td>
                                            <td>
                                                <button className="orderBtn" onClick={() => handleViewActivity(student)}>View Activity</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
        {/* Activity Modal */}
        {activityModalOpen && (
            <div className="modal-overlay" onClick={() => setActivityModalOpen(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-btn" onClick={() => setActivityModalOpen(false)}>×</button>
                    <h2>Order Activity: {activityStudent?.name}</h2>
                    {activityLoading ? (
                        <div>Loading...</div>
                    ) : activityError ? (
                        <div style={{ color: 'red' }}>{activityError}</div>
                    ) : (
                        <>
                            <OrderHistoryTable
                                orders={activityOrders.pending}
                                onShow={handleShowOrder}
                                title="Pending Orders"
                            />
                            <OrderHistoryTable
                                orders={activityOrders.completed}
                                onShow={handleShowOrder}
                                title="Completed/Cancelled Orders"
                            />
                        </>
                    )}
                </div>
            </div>
        )}
        {/* Full Order Modal for admin activity view */}
        {fullOrderModal && (
            <FullOrderModal
                fullOrderModal={fullOrderModal}
                setFullOrderModal={setFullOrderModal}
                fullOrder={fullOrder}
                setFullOrder={setFullOrder}
            />
        )}
        </div>
      );
    }
    
export default StudentPanel;