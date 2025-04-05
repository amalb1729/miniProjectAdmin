import { useEffect, useState } from "react";
import "./StudentPanel.css"
import { IKImage } from 'imagekitio-react';
function StudentPanel(){
    
    const [students,setStudents]=useState([]);
    const [filteredStudents,setFilteredStudents]=useState([])


    useEffect(()=>{
        fetch("/api/student/all").
        then(res=>res.json()).
        then(data=>{
                console.log(data);
                setFilteredStudents(data);
                setStudents(data);
        })
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
                     <h2>Student List</h2>
    
                     <div className="filter">

                         <div className="search-box">
                            <input type="text" value={filterSearch.name} onChange={(e)=>setQuery(e.target.value)} placeholder="Search items..."
                                className="search-input"/><i className="search-icon">🔍</i>
                        </div>
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
    
          {/* Student List */}
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>image</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.semester}</td>
                  <td>
                                        <IKImage
                                        path={student.pictureURL}
                                        urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                                        transformation={[{
                                            height: 100,
                                            width: 100
                                          }]}
                                        onError={(e) => (e.target.src = "https://placehold.co/100")} alt={student.name}
                                        />
                                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
export default StudentPanel;