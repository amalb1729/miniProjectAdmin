import { useEffect, useState } from "react";
import "./inventoryPanel.css"
import RemoveModal from "../modals/removeModal.jsx";
import AddModal from "../modals/addModal.jsx";
//import { myContext } from "../../App";
//import { useContext } from "react";

function InventoryPanel() {
    const [items, setItems] = useState([]);// array of items where finalised changes are made
    const [sortedItems,setSortedItems]=useState([]);//used for displaying items and making changes, whenever items array changes it will become that

    const [editStatus,setEditStatus]=useState({});//used for storing all item's edit status
    const [message,setMessage]=useState("");//error or success message
    const [removeOpen,setRemoveOpen]=useState(false);//removemodal flag
    const [removeItemId,setRemoveItemId]=useState(null);//stores id of items going to remove
    const [updateItemId,setUpdateItemId]=useState(null);//stores id of items going to update
    const [currentlyEdit,setCurrentlyEdit]=useState(false);//used for checking whether some edit is currently going on
    const [addingItem,setAddingItem]=useState(false);//add modal flag
    const [newItem,setNewItem]=useState(null);//stores new item that is gouning to be added
    const [validationError, setValidationError] = useState("");//validation error

    const [sortOrder,setSortOrder]=useState("default")//order for sorting
    const [sortField,setSortField]=useState("")//sorting field

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
    },[newItem]) //runs when newitem changes
    
    useEffect(()=>{
        if(items)
            setSortedItems([...items])
    },[items]) //runs when item changes
    
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




    
    
    const removeProps={removeItemFn,removeOpen,setRemoveOpen}
    const addProps={addingItem,setAddingItem,setNewItem}

    const changeName=(id,value)=>{
        setSortedItems((prev)=>prev.map((item)=>item._id==id?{...item,name:value}:item))
    }
    const changePrice=(id,value)=>{
        let newValue=value;
        if(!newValue){
            newValue="0"
        }
        if(newValue.indexOf("0")==0){
                if(newValue==0)
                    newValue="0"
                else
                    newValue=newValue[1]
        }
        setSortedItems((prev)=>prev.map((item)=>item._id==id?{...{...item,price:newValue}}:item))  
        }
      
    const changeStock=(id,value)=>{
        let newValue=value;
        if(!newValue){
            newValue="0"
        }
        if(newValue.indexOf("0")==0){
                if(newValue==0)
                    newValue="0"
                else
                    newValue=newValue[1]
        }
        setSortedItems((prev)=>prev.map((item)=>item._id==id?({...{...item,stock:newValue}}):item))
    }
    // i have destructed the object twice so that leading zeroes will not be presernt


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






    
        const editButton=(id)=>{
            setEditStatus((prev)=>({...prev , [id]:true}));
            setCurrentlyEdit(true)
        }
        const cancelButton=(id)=>{
            setSortedItems([...items]);
            setEditStatus((prev) => ({...prev, [id]: false}));
            setCurrentlyEdit(false)
        }
        const saveButton=(id)=>{
            // Find the item being edited
            const itemToUpdate = sortedItems.find(item => item._id === id);
            
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
                        {sortedItems.map((item,index) => (
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
                                        <button 
                                            className="cancel-btn" 
                                            onClick={()=>{cancelButton(item._id)}}>
                                            cancel
                                        </button>
                                        </div>
                                    ) : (
                                        <>
                                        <button 
                                            className="edit-btn" 
                                            onClick={()=>{if(!currentlyEdit) editButton(item._id)}}>
                                            Edit
                                        </button>
                                        </>
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
