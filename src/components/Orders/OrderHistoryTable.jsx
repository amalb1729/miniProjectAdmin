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
      <table className="orderTable">
        <thead>
          <tr>
            <th>Items</th>
            <th>Status</th>
            <th>Total</th>
            <th>Show</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderedItems.map((item) => item.itemName).join(", ")}</td>
                <td>{order.status}</td>
                <td>{order.orderedItems.reduce((total, item) => total + item.itemPrice * item.itemQuantity, 0)}</td>
                <td>
                  <button className="orderBtn" onClick={() => onShow(order._id, order.status)}>
                    Show
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
