import "./MyCart.css";
import CartItemComponent from "../../components/CartItem/CartItem";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { cartApi } from "../../api-helpers";
import { CartResponse } from "../../types/api-responses";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../types/user";

const MyCart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role !== UserRole.CUSTOMER) {
        navigate("/");
        return;
      }
    }

    (async () => {
      try {
        const response = await cartApi.getCart(accessToken);

        if (!response.status) {
          navigate("/");
          return;
        }

        if (response.data) {
          setCart(response.data);
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, [user]);

  const clearCart = async () => {
    await cartApi.clearCart(localStorage.getItem("accessToken") as string);
    setCart({} as CartResponse);
  };

  const handleCheckout = () => {
    if ((cart.items ?? []).length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout/information");
  };

  return (
    <div className="container">
      <h1>My Cart</h1>
      <ul className="cart-container">
        {((cart as CartResponse).items ?? []).map((item) => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </ul>
      <p className="total-price">Total: ${(cart.total ?? 0).toFixed(2)}</p>
      <div className="button-container">
        <div>
          <button className="button clear-cart-button" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        <div>
          <button className="button checkout-button" onClick={handleCheckout}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
