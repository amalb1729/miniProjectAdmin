import { useEffect, useState } from "react";
import "./inventoryPanel.css"
import RemoveModal from "../modals/removeModal.jsx";
import AddModal from "../modals/addModal.jsx";
//import { myContext } from "../../App";
//import { useContext } from "react";

function InventoryPanel() {
    const [items, setItems] = useState([]);
    const [editStatus,setEditStatus]=useState({});
    const [message,setMessage]=useState("");
    const [removeOpen,setRemoveOpen]=useState(false);
    const [removeItemId,setRemoveItemId]=useState(null);
    const [updateItemId,setUpdateItemId]=useState(null);
    const [currentlyEdit,setCurrentlyEdit]=useState(false);
    const [addingItem,setAddingItem]=useState(false);
    const [newItem,setNewItem]=useState(null)
    
    
    const removeProps={removeItemFn,removeOpen,setRemoveOpen}
    const addProps={addingItem,setAddingItem,setNewItem}

    const changeName=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,name:value}:item))
    }
    const changePrice=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,price:(Math.max(value,0))}:item))
    }
    const changeStock=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,stock:(Math.max(value,0))}:item))
    }

    async function updateItemFn() {

        if(!updateItemId) return;
        const response=await fetch("http://localhost:5000/item/update",{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( ...items.filter(element=>element._id==updateItemId))
        })
        
        const data=await response.json()
        if(response.ok){
            setMessage(data.message)
        }

        setUpdateItemId(null);
        setCurrentlyEdit(false);

        setTimeout(() => {
        setMessage(null);
        }, 2000);
    }

    async function removeItemFn() {
        if(!removeItemId) return;
        const response=await fetch("http://localhost:5000/item/remove",{
            method:"DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId:removeItemId })
        })
        
        const data=await response.json()
        if(response.ok){
            setItems((prev)=>([...(prev.filter((element)=>element._id!=removeItemId))]))
            setMessage(data.message)
        }

        setRemoveItemId(null);
        setCurrentlyEdit(false);

        setTimeout(() => {
        setMessage(null);
        }, 2000);
    }

    async function addItemFn() {
        if(!newItem) return;
        const response=await fetch("http://localhost:5000/item/add",{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        })
        
        const data=await response.json()
        if(response.ok){
            setItems((prev)=>([...prev,{...newItem,_id:data._id}]))
            setMessage(data.message)
        }

        setNewItem(null);
        setCurrentlyEdit(false);

        setTimeout(() => {
        setMessage(null);
        }, 2000);
    }



    // Fetch orders and items when admin logs in
    useEffect( () => {
        fetch("http://localhost:5000/item/items")
            .then(res => res.json())
            .then(data => { setItems(data);
                    const Status={};
                    data.forEach(element => Status[element._id]=false)
                    setEditStatus(Status);
            });
    }, []);

    useEffect(() => {
        if (updateItemId) {
            updateItemFn();
        }
    }, [updateItemId]); // Runs when updateItemId changes
    
    useEffect(()=>{
        if(newItem){
            addItemFn();
        }
    },[newItem])



    
        const editButton=(id)=>{
            setEditStatus((prev)=>({...prev , [id]:true}));
            setCurrentlyEdit(true)
        }
    
        const saveButton=(id)=>{
            setEditStatus((prev)=>({...prev , [id]:false}));
            setUpdateItemId(id)
            setCurrentlyEdit(false)
        }

        const removeButton=(id)=>{
                setRemoveOpen(true);
                setRemoveItemId(id);        
        }


    return (
        <>
        <div className="admin-panel">

            <h2>Admin Dashboard</h2>

            <div className="headings">
                <h3>Manage Items</h3>
                <button onClick={()=>setAddingItem(true)}>add</button>
            </div>
            {message?(<p className="msg">{message}</p>):null}

            <table>
                <thead>
                    <tr>
                        <th>Item name</th>
                        <th>stock</th>
                        <th>price</th>
                        <th>edit</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            {editStatus[item._id] ?(<td><input type="text" value={item.name} onChange={(e)=>changeName(item._id,e.target.value)}></input></td>)
                                                    :(<td>{item.name}</td>)}
                            {editStatus[item._id] ?(<td><input type="number" value={item.stock} onChange={(e)=>changeStock(item._id,e.target.value)}></input></td>)
                                                    :(<td>{item.stock}</td>)}
                            {editStatus[item._id] ?(<td><input type="number" value={item.price} onChange={(e)=>changePrice(item._id,e.target.value)}></input></td>)
                                                    :(<td>{item.price}</td>)}    

                            {editStatus[item._id]?(<td><div className="btngrp">
                                                     <button onClick={()=>saveButton(item._id)}>save</button>
                                                     <button onClick={()=>removeButton(item._id)}>remove</button>
                                                     </div></td>)
                                                    :(<td><button onClick={()=>{if(!currentlyEdit) editButton(item._id)}}>Edit</button></td>)}
                            </tr>
                ))}

                </tbody>
            </table>
        </div>
        {removeOpen?(<RemoveModal {...removeProps}/>):null}
        {addingItem?(<AddModal {...addProps}/>):null}

        </>
    );
}

export default InventoryPanel;
