import Modal from "./Modal";
import { useEffect, useState } from "react";
import "./fullOrderModal.css"
function FullOrderModal({ fullOrderModal, setFullOrderModal, fullOrder, setFullOrder }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let newTotal = 0;
        fullOrder?.orderedItems?.forEach((order) => {
            newTotal += (order.itemPrice * order.itemQuantity);
        });
        setTotal(newTotal);
    }, [fullOrder]);
    
    return (
        <>
            <Modal isOpen={fullOrderModal} closeModal={() => { setFullOrderModal(false); setFullOrder(null); }}>
                <div className="full-order-modal">
                    <h2 className="order-title">
                        Order Details
                        <span className="order-status" data-status={fullOrder?.status?.toLowerCase()}>
                            {fullOrder?.status || "Unknown"}
                        </span>
                    </h2>
                    
                    <div className="order-info">
                        <p className="order-id">Order ID: <span>{fullOrder?._id}</span></p>
                    </div>
                    
                    <div className="order-content">
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fullOrder?.orderedItems?.map((order, index) => (
                                    <tr key={order?._id || index} className="order-row">
                                        <td>{order?.itemName || "Name not found"}</td>
                                        <td>₹{(order?.itemPrice || 0).toLocaleString()}</td>
                                        <td>{order?.itemQuantity || "0"}</td>
                                        <td>₹{((order?.itemPrice || 0) * (order?.itemQuantity || 0)).toLocaleString()}</td>
                                    </tr>
                                ))}
                                
                                <tr className="order-total-row">
                                    <td colSpan="3">Grand Total</td>
                                    <td>₹{total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default FullOrderModal;
