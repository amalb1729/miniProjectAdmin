import Modal from "./modal";
import { useState } from "react";
import "./editStatusModal.css";

function EditStatusModal({statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}){
    const statuses=["Pending","Completed","Cancelled"]
    const [selected, setSelected] = useState(newStatus.status);
    const prevStatus=newStatus.status;
    
    return(
        <Modal isOpen={statusModal} closeModal={()=>{setStatusModal(false);setNewStatus({})}}>
            <div className="status-modal-content">
                <h2 className="status-modal-title">Change Order Status</h2>
                
                <div className="status-options">
                    {statuses.map((element,index)=>(
                        <label key={index} className="status-option">
                            <input 
                                key={index}
                                name="statusBtn"
                                type="radio"
                                value={element}
                                checked={selected===element}
                                onChange={(e)=>(setSelected(e.target.value))}
                                className="status-radio"
                            />
                            <span className="status-label">{element}</span>
                        </label>
                    ))}
                </div>

                <div className="status-modal-actions">
                    <button 
                        className="modal-btn cancel-btn"
                        onClick={()=>{setStatusModal(false);setNewStatus({})}}>
                        Cancel
                    </button>
                    <button 
                        className="modal-btn confirm-btn"
                        onClick={()=>{
                            changeStatusFn(newStatus.id,selected,prevStatus);
                            setStatusModal(false);
                        }}>
                        Change Status
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default EditStatusModal;