import Modal from "./modal";
import { useState } from "react";
import "./removeModal.css";

//import { myContext } from "../../App";
//import { useContext } from "react";
function RemoveModal({removeItemFn,removeOpen,setRemoveOpen}){

    //const {confirmRemove,setConfirmRemove,removeOpen,setRemoveOpen}=useContext(myContext);

    return(
        <>
        <Modal isOpen={removeOpen} closeModal={()=>setRemoveOpen(false)}>
            <div className="remove-modal-content">
                <span className="remove-modal-message">
                    Are you sure, you want to remove this item?
                </span>
                <div className="remove-modal-actions">
                    <button 
                        className="modal-btn cancel-btn"
                        onClick={()=>setRemoveOpen(false)}>
                        Cancel
                    </button>
                    <button 
                        className="modal-btn remove-btn"
                        onClick={()=>{
                            removeItemFn();
                            setRemoveOpen(false);
                        }}>
                        Remove
                    </button>
                </div>
            </div>
        </Modal>
        </>
    )



}


export default RemoveModal