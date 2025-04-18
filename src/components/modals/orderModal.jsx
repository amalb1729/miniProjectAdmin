import Modal from "./Modal";
import "./orderModal.css";
import "./editStatusModal.css"
import { useState,useEffect} from "react";

function OrderModal({modalIsOpen,setModelIsOpen,showing,hideFullOrder,statusModal,setStatusModal,newStatus,setNewStatus,changeStatusFn}){

    const statuses=["Pending","Completed","Cancelled"]
    const [selected, setSelected] = useState(newStatus.status);
    const prevStatus=newStatus.status;

    const [total,setTotal]=useState(0);
    
        useEffect(()=>{
            showing?.orderedItems?.forEach((order, index) =>  setTotal((prev)=>(prev+(order.itemPrice*order.itemQuantity))));
        },[])


    return(
        <Modal isOpen={modalIsOpen && statusModal} closeModal={()=>{setModelIsOpen(false);setStatusModal(false);hideFullOrder();setNewStatus({})}}>
                <h2 className="modal-title">Order Details</h2>
                <div className="order-details-table">
                    <table className="details-table">
                        <thead>
                            <tr>
                                {/* <th>Item ID</th> */}
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Sub Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {showing.orderedItems.map((order,index) => {
                            if(order)
                                return(
                                    <tr key={order._id} className="item-row">
                                        {/* <td className="item-id">{order.itemId}</td> */}
                                        <td className="item-name">{order.itemName}</td>
                                        <td className="item-price">₹{order.itemPrice || "N/A"}</td>
                                        <td className="item-quantity">{order.itemQuantity}</td>
                                        <td>₹{order.itemPrice*order.itemQuantity}</td>
                                    </tr>
                                )
                            else
                                return(
                                    <tr key={index} className="item-row missing">
                                        <td className="item-id">ID not found</td>
                                        <td className="item-name">Name not found</td>
                                        <td className="item-price">Price not found</td>
                                        <td className="item-quantity">Quantity not found</td>
                                    </tr>
                                )
                            }
                        )}
                        <tr><td colSpan="3">Grand Total</td>
                        <td>₹{total}</td></tr>
                        </tbody>
                    </table>
                </div>


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
                        onClick={()=>{setStatusModal(false);setNewStatus({});setModelIsOpen(false);}}>
                        Cancel
                    </button>
                    <button 
                        className="modal-btn confirm-btn"
                        onClick={()=>{
                            changeStatusFn(newStatus.id,selected,prevStatus);
                            setStatusModal(false);
                            setModelIsOpen(false);
                        }}>
                        Change Status
                    </button>
                </div>
            </div>


        </Modal>
    )
}

export default OrderModal;