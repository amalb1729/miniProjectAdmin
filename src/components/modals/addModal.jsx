import { useState } from "react";
import Modal from "./modal.jsx";

function AddModal({addingItem,setAddingItem,setNewItem}) {

    const [tempItem,setTempItem]=useState({name:" ",price:0,stock:0})

    const setItemPrice=(value)=>{
        setTempItem((prev)=>({...prev,price:Math.max(value,0)}))
    }
    const setItemName=(value)=>{
        setTempItem((prev)=>({...prev,name:value}))
    }
    const setItemStock=(value)=>{
        setTempItem((prev)=>({...prev,stock:Math.max(value,0)}))
    }
    console.log(tempItem)
    return (
        <>
        <Modal isOpen={addingItem} closeModal={() => { setAddingItem(false); }}>
            <label htmlFor="iname">name:</label>
            <input type="text" id="iname" value={tempItem["name"]} onChange={(e)=>{setItemName(e.target.value)}}></input>
            <label htmlFor="istock">stock:</label>
            <input type="number" id="istock" value={tempItem["stock"]} onChange={(e)=>{setItemStock(e.target.value)}}></input>
            <label htmlFor="iprice">price:</label>
            <input type="number" id="iprice" value={tempItem["price"]} onChange={(e)=>{setItemPrice(e.target.value)}}></input>
            <button onClick={()=>{setAddingItem(false);}}>cancel</button>
            <button onClick={()=>{setNewItem(tempItem);setAddingItem(false);}}>confirm</button>
        </Modal>
        </>
    )
}

export default AddModal;
