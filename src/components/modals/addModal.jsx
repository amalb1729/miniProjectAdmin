import { useState } from "react";
import Modal from "./modal.jsx";
import "./addModal.css";

function AddModal({addingItem, setAddingItem, setNewItem}) {
    const [tempItem,setTempItem]=useState({name:"",price:0,stock:0})
    const [errors, setErrors] = useState({name: "", price: "", stock: ""})

    const setItemPrice=(value)=>{
        setTempItem((prev)=>({...prev,price:Math.max(value,0)}))
        setErrors(prev => ({...prev, price: ""}))
    }
    const setItemName=(value)=>{
        setTempItem((prev)=>({...prev,name:value}))
        setErrors(prev => ({...prev, name: ""}))
    }
    const setItemStock=(value)=>{
        setTempItem((prev)=>({...prev,stock:Math.max(value,0)}))
        setErrors(prev => ({...prev, stock: ""}))
    }

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
                        onChange={(e)=>{setItemName(e.target.value)}}
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
                        onChange={(e)=>{setItemStock(e.target.value)}}
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
                        onChange={(e)=>{setItemPrice(e.target.value)}}
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
