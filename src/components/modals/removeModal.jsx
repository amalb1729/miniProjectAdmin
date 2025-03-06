import Modal from "./modal";
import { useState } from "react";

//import { myContext } from "../../App";
//import { useContext } from "react";
function RemoveModal({removeItemFn,removeOpen,setRemoveOpen}){

    //const {confirmRemove,setConfirmRemove,removeOpen,setRemoveOpen}=useContext(myContext);

    return(
        <>
        <Modal isOpen={removeOpen} closeModal={()=>setRemoveOpen(false)}>
        <div>
            <span>Are you sure, you want to remove this item?</span>
            <button onClick={()=>setRemoveOpen(false)}>cancel</button>
            <button onClick={()=>{removeItemFn();
                                setRemoveOpen(false);
                                 }}>remove</button>
        </div>
        </Modal>
        </>
    )



}


export default RemoveModal