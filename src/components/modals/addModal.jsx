import { useEffect, useState } from "react";
import Modal from "./modal.jsx";
import "./addModal.css";

function AddModal({addingItem, setAddingItem, setNewItem}) {
    const [tempItem,setTempItem]=useState({name:"",price:0,stock:0})
    const [errors, setErrors] = useState({name: "", price: "", stock: ""})

    //destructing twice so that leading zeroes will be gone
    const setItemPrice=(e)=>{
        setTempItem((prev)=>({...{...prev,price:Math.max(e.target.value,0)}}))
        e.target.value=Math.max(e.target.value,0)
        setErrors(prev => ({...prev, price: ""}))
    }
    const setItemName=(e)=>{
        setTempItem((prev)=>({...prev,name:e.target.value}))
        setErrors(prev => ({...prev, name: ""}))
    }
    const setItemStock=(e)=>{
        setTempItem((prev)=>({...{...prev,stock:Math.max(e.target.value,0)}}))
        e.target.value=Math.max(e.target.value,0)
        setErrors(prev => ({...prev, stock: ""}))
    }

    useEffect(()=>{
        console.log(tempItem)
    },[tempItem])
    const validateForm = () => {
        let isValid = true
        const newErrors = {}

        if (!tempItem.name.trim()) {
            newErrors.name = "Name is required"
            isValid = false
        }
        if (tempItem.price <= 0) {
            newErrors.price = "Price must be greater than 0"
            isValid = false
        }
        if (tempItem.stock <= 0) {
            newErrors.stock = "Stock must be greater than 0"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = () => {
        if (validateForm()) {
            setTempItem((prev)=>({...prev,name:tempItem.name.trim().replace(/\s+/g, ' ')}))
            setNewItem(tempItem)
            setAddingItem(false)
        }
    }

    console.log(tempItem)
    return (
        <>
        <Modal isOpen={addingItem} closeModal={() => { setAddingItem(false); }}>
            <div className="add-modal-content">
                <h2 className="add-modal-title">Add New Item</h2>
                
                <div className="form-group">
                    <label htmlFor="iname">Name:</label>
                    <input 
                        type="text" 
                        id="iname" 
                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                        value={tempItem.name} 
                        onChange={(e)=>{setItemName(e)}}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="istock">Stock:</label>
                    <input 
                        type="number" 
                        id="istock" 
                        className={`form-input ${errors.stock ? 'input-error' : ''}`}
                        value={tempItem.stock} 
                        onChange={(e)=>{setItemStock(e)}}
                    />
                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="iprice">Price:</label>
                    <input 
                        type="number" 
                        id="iprice" 
                        className={`form-input ${errors.price ? 'input-error' : ''}`}
                        value={tempItem.price} 
                        onChange={(e)=>{setItemPrice(e)}}
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                </div>
                
                <div className="modal-actions">
                    <button 
                        className="btn btn-cancel"
                        onClick={()=>{setAddingItem(false);}}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-confirm"
                        onClick={handleSubmit}>
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
        </>
    )
}

export default AddModal;
