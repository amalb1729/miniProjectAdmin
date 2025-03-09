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
    const [validationError, setValidationError] = useState("");
    
    
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

        try{
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

        else{
            setMessage(data.message)
        }
        setNewItem(null);
        setCurrentlyEdit(false);

        setTimeout(() => {
        setMessage(null);
        }, 2000);


        }catch(error){
            console.log(error)
        }
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
            // Find the item being edited
            const itemToUpdate = items.find(item => item._id === id);
            
            // Validate name and price
            if (!itemToUpdate.name.trim()) {
                setValidationError("Item name cannot be empty");
                setTimeout(() => setValidationError(""), 3000);
                return;
            }
            
            if (itemToUpdate.price <= 0) {
                setValidationError("Price must be greater than 0");
                setTimeout(() => setValidationError(""), 3000);
                return;
            }

            // If validation passes, proceed with save
            setEditStatus((prev) => ({...prev, [id]: false}));
            setUpdateItemId(id);
            setCurrentlyEdit(false);
            setValidationError("");
        }

        const removeButton=(id)=>{
                setRemoveOpen(true);
                setRemoveItemId(id);        
        }


    return (
        <>
        <div className="admin-panel">
            <h2 className="admin-panel-title">Admin Dashboard</h2>

            <div className="panel-header">
                <h3 className="section-title">Manage Items</h3>
                <button className="add-item-btn" onClick={()=>setAddingItem(true)}>
                    <span className="btn-text">Add Item</span>
                </button>
            </div>
            
            {message && <p className="status-message success">{message}</p>}
            {validationError && <p className="status-message error">{validationError}</p>}

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} className="inventory-row">
                                <td>
                                    {editStatus[item._id] ? (
                                        <input 
                                            type="text" 
                                            className="edit-input"
                                            value={item.name} 
                                            onChange={(e)=>changeName(item._id,e.target.value)}
                                        />
                                    ) : (
                                        <span className="item-name">{item.name}</span>
                                    )}
                                </td>
                                <td>
                                    {editStatus[item._id] ? (
                                        <input 
                                            type="number" 
                                            className="edit-input"
                                            value={item.stock} 
                                            onChange={(e)=>changeStock(item._id,e.target.value)}
                                        />
                                    ) : (
                                        <span className="item-stock">{item.stock}</span>
                                    )}
                                </td>
                                <td>
                                    {editStatus[item._id] ? (
                                        <input 
                                            type="number" 
                                            className="edit-input"
                                            value={item.price} 
                                            onChange={(e)=>changePrice(item._id,e.target.value)}
                                        />
                                    ) : (
                                        <span className="item-price">₹{item.price}</span>
                                    )}
                                </td>
                                <td>
                                    {editStatus[item._id] ? (
                                        <div className="action-buttons">
                                            <button className="save-btn" onClick={()=>saveButton(item._id)}>Save</button>
                                            <button className="remove-btn" onClick={()=>removeButton(item._id)}>Remove</button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="edit-btn" 
                                            onClick={()=>{if(!currentlyEdit) editButton(item._id)}}>
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        {removeOpen && <RemoveModal {...removeProps}/>}
        {addingItem && <AddModal {...addProps}/>}
        </>
    );
}

export default InventoryPanel;
