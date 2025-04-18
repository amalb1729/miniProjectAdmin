import { useEffect, useState } from "react";
import Modal from "./Modal";
import { IKContext, IKUpload } from 'imagekitio-react';
import "./addModal.css";

function AddModal({addingItem, setAddingItem, setNewItem}) {
    const [tempItem,setTempItem]=useState({name:"",price:0,stock:0,pictureURL:""})
    const [uploadError, setUploadError] = useState("")
    const [isUploading, setIsUploading] = useState(false)
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
        if (!tempItem.pictureURL) {
            newErrors.image = "Please upload an image"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const authenticator = async () => {
        try {
            const response = await fetch('/api/item/uploadCheck');
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Authentication failed:', error);
            setUploadError('Failed to authenticate upload');
            return null;
        }
    };

    const onUploadError = err => {
        console.error("Upload Error:", err);
        setUploadError("Failed to upload image");
        setIsUploading(false);
    };

    const onUploadSuccess = async(res) => {
        console.log("Upload Success:", res);
        setTempItem(prev => ({ ...prev, pictureURL: res.filePath }));
        setUploadError("");
        setIsUploading(false);
    };

    const onUploadStart = () => {
        setIsUploading(true);
        setUploadError("");
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setTempItem((prev)=>({...prev, name:tempItem.name.trim().replace(/\s+/g, ' ')}))
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
                    <label>Image Upload:</label>
                    <div className="upload-container">
                        <IKContext 
                            publicKey={import.meta.env.VITE_PUBLIC_PUBLIC_KEY}
                            urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                            authenticator={authenticator}
                        >
                            <div className="upload-button-wrapper">
                                <button type="button" className="upload-button" disabled={isUploading}>
                                    <span className="upload-icon">📸</span>
                                    {isUploading ? 'Uploading...' : 'Choose Image'}
                                </button>
                                <IKUpload
                                    className="upload-input"
                                    useUniqueFileName={true}
                                    onError={onUploadError}
                                    onSuccess={onUploadSuccess}
                                    onUploadStart={onUploadStart}
                                    folder={"/items"}
                                />
                            </div>
                        </IKContext>
                        {tempItem.pictureURL && (
                            <div className="image-preview-wrapper">
                                <img 
                                    src={`${import.meta.env.VITE_PUBLIC_URL_ENDPOINT}/${tempItem.pictureURL}`}
                                    alt="Preview"
                                    className="image-preview"
                                />
                            </div>
                        )}
                        {uploadError && <span className="error-message">{uploadError}</span>}
                        {errors.image && <span className="error-message">{errors.image}</span>}
                    </div>
                </div>
                
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
