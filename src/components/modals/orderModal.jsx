import Modal from "./modal";
import "./orderModal.css";

function OrderModal({modalIsOpen,setModelIsOpen,showing,hideFullOrder}){
    return(
        <Modal isOpen={modalIsOpen} closeModal={()=>{setModelIsOpen(false);hideFullOrder()}}>
                <h2 className="modal-title">Order Details</h2>
                <div className="order-details-table">
                    <table className="details-table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {showing.orderedItems.map((order,index) => {
                            if(order)
                                return(
                                    <tr key={order._id} className="item-row">
                                        <td className="item-id">{order.itemId}</td>
                                        <td className="item-name">{order.itemName}</td>
                                        <td className="item-price">₹{order.itemPrice || "N/A"}</td>
                                        <td className="item-quantity">{order.itemQuantity}</td>
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
                        </tbody>
                    </table>
                </div>
        </Modal>
    )
}

export default OrderModal;