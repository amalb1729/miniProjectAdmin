import Modal from "./modal";



function OrderModal({modalIsOpen,setModelIsOpen,showing,hideFullOrder}){


    return(
        
        <Modal isOpen={modalIsOpen} closeModal={()=>{setModelIsOpen(false);
                                                    hideFullOrder()}}>
            <div>
            <table>
            <thead>
                <tr>
                        <th>item id</th>
                        <th>item name</th>
                        <th>price</th>
                        <th>quantity</th>
                    </tr>
                </thead>
                <tbody>
                {
                    showing.orderedItems.map((order,index) => {
                        if(order)
                        return(
                        <tr key={order._id}>
                            <td>{order.itemId["_id"] || "id not found"}</td>
                            <td>{order.itemId["name"]}</td>{/* Display user's name */}
                            <td>{order.itemId["price"]}</td>
                            <td>{order.quantity}</td></tr>
                        )
                        else
                            return(
                            <tr key={index}>
                            <td>{"id not found"}</td>
                            <td>{"name"}</td>{/* Display user's name */}
                            <td>{"price"}</td>
                            <td>{"quantity"}</td></tr>
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