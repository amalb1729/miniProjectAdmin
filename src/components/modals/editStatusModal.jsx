import Modal from "./modal";
import { useState } from "react";

function EditStatusModal({statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}){


    const statuses=["Pending","Completed","Cancelled"]
    const [selected, setSelected] = useState(newStatus.status);
    return(
        <Modal isOpen={statusModal} closeModal={()=>{setStatusModal(false);
                                                        setNewStatus({})}}>

        {statuses.map((element,index)=>(
            <label key={index}>
            <input key={index}
            name="statusBtn"
            type="radio"
            value={element}
            checked={selected===element}
            onChange={(e)=>(setSelected(e.target.value))}/>
            {element} 
            </label>
        ))}
        
        <button onClick={()=>{setStatusModal(false);setNewStatus({})}}>cancel</button>
            <button onClick={()=>{changeStatusFn(newStatus.id,selected);
                                 setStatusModal(false);
                                 }}>change</button>
        </Modal>
    )
}

export default EditStatusModal;