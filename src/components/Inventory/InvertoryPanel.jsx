import { useEffect, useState } from "react";
import "./inventoryPanel.css"
import RemoveModal from "../modals/removeModal.jsx";
import AddModal from "../modals/addModal.jsx";
//import { myContext } from "../../App";
//import { useContext } from "react";

function InventoryPanel() {
    const [items, setItems] = useState([]);// array of items 
    const [sortedItems,setSortedItems]=useState([]);//sorted items

    const [editStatus,setEditStatus]=useState({});
    const [message,setMessage]=useState("");
    const [removeOpen,setRemoveOpen]=useState(false);
    const [removeItemId,setRemoveItemId]=useState(null);
    const [updateItemId,setUpdateItemId]=useState(null);
    const [currentlyEdit,setCurrentlyEdit]=useState(false);
    const [addingItem,setAddingItem]=useState(false);
    const [newItem,setNewItem]=useState(null)
    const [validationError, setValidationError] = useState("");

    const [sortOrder,setSortOrder]=useState("default")
    const [sortField,setSortField]=useState("")

    const sortItems=(field)=>{

        if(sortOrder=="default" || sortField=="" || sortField!=field){
            if(field=="name")
                setSortedItems([...items].sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                    }))
            else
                setSortedItems([...items].sort((a,b)=>(a[field]-b[field]))) //ascending
            setSortOrder("ascending")
        }
        else if(sortOrder=="ascending"){
            setSortedItems((prev)=>[...prev].reverse()) // descending
            setSortOrder("descending")
        }
        else{
            setSortedItems([...items]) // default
            setSortOrder("default")
        }
        setSortField(field)
    }



    useEffect(()=>{
        if(items)
            setSortedItems([...items])
    },[items])

    
    
    const removeProps={removeItemFn,removeOpen,setRemoveOpen}
    const addProps={addingItem,setAddingItem,setNewItem}

    const changeName=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,name:value}:item))
        console.log(typeof(value))
    }
    const changePrice=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,price:(Math.max(value,0))}:item))
    }
    const changeStock=(id,value)=>{
        setItems((prev)=>prev.map((item)=>item._id==id?{...item,stock:(Math.max(value,0))}:item))
        console.log(typeof(value))
    }

    async function updateItemFn() {

        if(!updateItemId) return;
        const response=await fetch("/api/item/update",{
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
        const response=await fetch("/api/item/remove",{
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
        const response=await fetch("/api/item/add",{
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
        fetch("/api/item/items")
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
                            <th><button className="sort-btns" onClick={()=>sortItems("name")}>Item Name</button></th>
                            <th> <button className="sort-btns" onClick={()=>sortItems("stock")}>Stock</button> </th>
                            <th><button className="sort-btns" onClick={()=>sortItems("price")}>Price</button> </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map(item => (
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
