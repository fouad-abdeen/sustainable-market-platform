import "./Checkout.css";
import React, { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { orderApi } from "../../api-helpers";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../types/user";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [shippingRate] = useState(1);
  const { checkoutInfo } = useContext(CheckoutContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role !== UserRole.CUSTOMER) {
        navigate("/");
        return;
      }
    }

    if (Object.keys(checkoutInfo ?? {}).length === 0) {
      navigate("/checkout/information");
    }

    if (Object.keys(cart ?? {}).length === 0) {
      navigate("/cart");
    }
  });

  const placeOrder = () => {
    const orderPlacementButton = document.getElementById("order-button") as HTMLButtonElement;
    orderPlacementButton.disabled = true;

    (async () => {
      try {
        const response = await orderApi.placeOrder(
          checkoutInfo,
          localStorage.getItem("accessToken") as string
        );

        if (!response.status) {
          throw new Error("You have to be logged in as a customer to place an order!");
        }
      } catch (error) {
        alert(error);
        orderPlacementButton.disabled = false;
        navigate("/cart");
        return;
      }

      alert("Placed your order successfully!");
      navigate("/orders");
    })();
  };

  return (
    <div className="checkout">
      <h2>Checkout Confirmation</h2>
      <div className="customer-information">
        <h3>Customer Information</h3>
        <p>Name: {`${checkoutInfo.firstName} ${checkoutInfo.lastName}`}</p>
        <p>Email: {checkoutInfo.email}</p>
        <p>Phone Number: {checkoutInfo.phoneNumber}</p>
        <p>Address: {checkoutInfo.address}</p>
      </div>
      <div>
        <h3>Shipping Rate</h3>
        <label>
          <input
            type="checkbox"
            name="shippingRate"
            defaultChecked={true}
            className="checkbox"
            disabled
          />
          ${shippingRate}
        </label>
      </div>
      <div className="payment-method">
        <h3>Payment Method</h3>
        <label>
          <input
            type="checkbox"
            name="paymentMethod"
            defaultChecked={true}
            className="checkbox"
            disabled
          />
          Cash On Delivery
        </label>
      </div>
      <div className="item-details">
        <h3>Items</h3>
        {(cart.items ?? []).map((item, index) => (
          <div className="product-info" key={item.id}>
            <p>{index + 1}.</p>
            <p>Name: {item.name}</p>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <p>Total: ${cart.total + shippingRate}</p>
        <button id="order-button" type="button" onClick={placeOrder} className="btn btn-success">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
