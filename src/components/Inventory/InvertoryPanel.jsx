import { useEffect, useState, useContext } from "react";
import "./inventoryPanel.css"
import RemoveModal from "../modals/removeModal.jsx";
import AddModal from "../modals/addModal.jsx";
import { myContext } from "../../App";
import { IKImage } from 'imagekitio-react';
import ImageUploader from "./imageUploader.jsx";
function InventoryPanel() {
    const { accessToken, refreshRequest } = useContext(myContext);
    const [items, setItems] = useState([]);// array of items where finalised changes are made
    const [sortedItems,setSortedItems]=useState([]);//used for sorting
    const [finalItems,setFinalItems]=useState([]);//used for displaying 

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

    const [query,setQuery]=useState("")
    const [filterItems,setFilteredItems]=useState([])
    const [change,setChange]=useState(0);

    useEffect(()=>{
        if(query.trim()==="")
          setFinalItems([...sortedItems]);
        if(query && items){
          setFinalItems([...sortedItems.filter((item)=>(item.name.toLowerCase().includes(query.toLowerCase())))])
        }
    },[query,items,sortedItems])

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
        
        try {
            // Find the item to update
            const itemToUpdate = sortedItems.find(element => element._id === updateItemId);
            
            if (!itemToUpdate) {
                console.error("Item not found for update");
                setMessage("Error: Item not found");
                return;
            }
            
            console.log("Updating item:", itemToUpdate);
            
            let token = accessToken;
            if(!token) {
                token = await refreshRequest();
            }
            
            let response = await fetch("/api/item/update", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(itemToUpdate),
                credentials: 'include'
            });
            
            if (response.status === 401) {                                       
                token = await refreshRequest();
                response = await fetch("/api/item/update", {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(itemToUpdate),
                    credentials: 'include'
                });                  
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Server responded with ${response.status}: ${errorText}`);
                setMessage(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
                return;
            }
            
            const data = await response.json();
            console.log("Update response:", data);
            setMessage(data.message);
            
            // Update the items array with the updated item
            setItems(prevItems => prevItems.map(item => 
                item._id === updateItemId ? itemToUpdate : item
            ));
        } catch (error) {
            console.error("Error updating item:", error);
            setMessage("Error: " + (error.message || "Failed to update item"));
        } finally {
            setUpdateItemId(null);
            setCurrentlyEdit(false);
            
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
    }

    async function removeItemFn() {
        if(!removeItemId) return;
        
        try {
            console.log("Removing item ID:", removeItemId);
            
            let token = accessToken;
            if (!token) token = await refreshRequest();
            
            let response = await fetch("/api/item/remove",{
                method:"DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({id:removeItemId}),
                credentials: 'include'
            });
            
            if (response.status === 401) {
                token = await refreshRequest();
                response = await fetch("/api/item/remove",{
                    method:"DELETE",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({id:removeItemId}),
                    credentials: 'include'
                });
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Server responded with ${response.status}: ${errorText}`);
                setMessage(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
                return;
            }
            
            const data = await response.json();
            console.log("Remove response:", data);
            
            // Update items state by filtering out the removed item
            setItems((prev) => ([...(prev.filter((element) => element._id !== removeItemId))]));
            setMessage(data.message);
        } catch (error) {
            console.error("Error removing item:", error);
            setMessage("Error: " + (error.message || "Failed to remove item"));
        } finally {
            setRemoveItemId(null);
            setCurrentlyEdit(false);
            
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
    }

    async function addItemFn() {
        if(!newItem) return;

        try {
            console.log("Adding new item:", newItem);
            
            let token = accessToken;
            if (!token) token = await refreshRequest();
            
            let response = await fetch("/api/item/add",{
                method:"PUT", // Changed to PUT to match the route definition
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(newItem),
                credentials: 'include'
            });
            
            if (response.status === 401) {
                token = await refreshRequest();
                response = await fetch("/api/item/add",{
                    method:"PUT", // Changed to PUT to match the route definition
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify(newItem),
                    credentials: 'include'
                });
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Server responded with ${response.status}: ${errorText}`);
                setMessage(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
                return;
            }
            
            const data = await response.json();
            console.log("Add response:", data);
            
            if (data._id) {
                // Add the new item to the items state with the returned ID
                setItems((prev) => ([...prev, {...newItem, _id: data._id}]));
                setMessage(data.message || "Item added successfully");
            } else {
                setMessage(data.message || "Item added but no ID returned");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            setMessage("Error: " + (error.message || "Failed to add item"));
        } finally {
            setNewItem(null);
            setCurrentlyEdit(false);
            
            setTimeout(() => {
                setMessage(null);
            }, 2000);
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


            <div className="search-container">
                <div className="search-box">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e)=>setQuery(e.target.value)} 
                    placeholder="    Search items..."
                    className="search-input"
                />
                </div>
                {/* {!filterItems ? null : (
                <div className="search-results">
                    {filterItems.map((element) => (
                    <div 
                        key={element.id} 
                        className="search-result-item"
                        onClick={() => {scroll(element._id); setQuery("")}}
                    >
                        <span>{element.name}</span>
                    </div>
                    ))}
                </div>
                )} */}
            </div>

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th><button className="sort-btns" onClick={()=>sortItems("name")}>{`Item Name ${sortField=="name"?(sortOrder=="ascending"?("↑"):(sortOrder=="descending"?("↓"):(""))):("")}`}</button></th>
                            <th> <button className="sort-btns" onClick={()=>sortItems("stock")}>{`Item Stock ${sortField=="stock"?(sortOrder=="ascending"?("↑"):(sortOrder=="descending"?("↓"):(""))):("")}`}</button> </th>
                            <th><button className="sort-btns" onClick={()=>sortItems("price")}>{`Item Price ${sortField=="price"?(sortOrder=="ascending"?("↑"):(sortOrder=="descending"?("↓"):(""))):("")}`}</button> </th>
                            <th>images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalItems.map((item,index) => (
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
                                <td>{editStatus[item._id] ? 
                                
                                (<ImageUploader item={item}/>)
                                :(<IKImage
                                        path={item.pictureURL}
                                        urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                                        transformation={[{
                                            height: 100,
                                            width: 100
                                          }]}
                                        onError={(e) => (e.target.src = "https://placehold.co/100")} alt={item.name}
                                        />)
                                    }
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
