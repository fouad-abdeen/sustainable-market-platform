import "./OrderDetailsModal.css";
import { OrderResponse } from "../../types/api-responses";
import React from "react";

interface ModalProps {
  order: OrderResponse;
}

const OrderDetailsModal: React.FC<ModalProps> = ({ order }) => {
  const onClose = () => {
    const modal = document.getElementById(`M${order.id}`) as HTMLDivElement;
    modal.style.display = "none";
  };

  return (
    <>
      <div id={`M${order.id}`} className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>

          <div className="customer-information" style={{ width: "50%", margin: "auto" }}>
            <h3>Customer Information</h3>
            <p>
              Name:{" "}
              {`${order.customerCheckoutInfo.firstName} ${order.customerCheckoutInfo.lastName}`}
            </p>
            <p>Email: {order.customerCheckoutInfo.email}</p>
            <p>Phone Number: {order.customerCheckoutInfo.phoneNumber}</p>
            <p>Address: {order.customerCheckoutInfo.address}</p>
          </div>

          <h2>Order Items</h2>
          <div className="items-container" style={{ width: "50%", margin: "auto" }}>
            {(order.items ?? []).map((item) => (
              <div className="item" key={item.id}>
                <div className="item-details">
                  <span className="item-field">Name: {item.name}</span>
                  <span className="item-field">Quantity: {item.quantity}</span>
                  <span className="item-field">Price: ${item.price.toFixed(2)}</span>
                  <span className="item-field">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <h4 style={{ textAlign: "center" }}>Shipping Rate: $1</h4>
          <h2>Total: ${order.totalAmount}</h2>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;
