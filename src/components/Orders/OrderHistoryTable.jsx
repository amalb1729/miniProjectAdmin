import React from "react";

/**
 * Reusable order history table for both profile and admin views.
 * @param {Object[]} orders - Array of order objects
 * @param {Function} onShow - Callback to view full order details (orderId, status)
 * @param {string} title - Table title
 */
export default function OrderHistoryTable({ orders = [], onShow, title = "Orders" }) {
  return (
    <div className="order-history-table">
      <h3>{title}</h3>
      <div className="table-responsive">
        <table className="orderTable">
          <thead>
            <tr>
              <th>Items</th>
              <th>Ordered At</th>
              <th>Status</th>
              <th>Total</th>
              <th>Show</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="item-names">
                      {order.orderedItems.map((item) => item.itemName).join(", ")}
                    </div>
                  </td>
                  <td>{new Date(order.orderedAt).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className="amount">
                      ₹{order.orderedItems.reduce((total, item) => total + item.itemPrice * item.itemQuantity, 0)}
                    </span>
                  </td>
                  <td>
                    <button className="orderBtn" onClick={() => onShow(order._id, order.status)}>
                      Show
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
