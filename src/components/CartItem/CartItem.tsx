import "./CartItem.css";
import { useContext, useState } from "react";
import { CartItem } from "../../types/item";
import { CartContext } from "../../contexts/CartContext";
import { cartApi } from "../../api-helpers";
import { CartResponse } from "../../types/api-responses";
import { useNavigate } from "react-router-dom";

const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity);
  const [total, setTotal] = useState(item.price * item.quantity);
  const { cart, setCart } = useContext(CartContext);

  const cartErrors = {
    outOfStock: "Item is out of stock at the moment",
    unavailable: "Item is not available now for purchase",
  };

  const handleQuantityChange = async (newQuantity?: number) => {
    let updatedQuantity = newQuantity ?? quantity;

    if (updatedQuantity > 5) {
      alert("You cannot add more than 5 items of the same type to the cart");
      updatedQuantity = 5;
      setQuantity(updatedQuantity);
    }

    setTotal(item.price * updatedQuantity);

    try {
      const response = await cartApi.updateItemInCart(
        { id: item.id, quantity: updatedQuantity },
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        navigate("/");
      }
    } catch (error: any) {
      if (error.message === cartErrors.outOfStock || error.message === cartErrors.unavailable) {
        alert(error.message);
        onRemoveItem();
        return;
      } else if (error.message.split("Not enough in-stock").length > 1) {
        const availableQuantity = error.message.split(" ")[error.message.split(" ").length - 2];
        alert(error.message);
        handleQuantityChange(availableQuantity);
        return;
      }
    }

    const updatedCart = {
      ...cart,
      items: (cart.items as CartItem[]).map((cartItem) => {
        if (cartItem.id === item.id) {
          return {
            ...cartItem,
            quantity: updatedQuantity,
          };
        }
        return cartItem;
      }),
    };

    setCart({
      ...updatedCart,
      total: (updatedCart as CartResponse).items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    });

    setQuantity(updatedQuantity);
  };

  const onRemoveItem = async () => {
    await cartApi.removeItemFromCart(item.id, localStorage.getItem("accessToken") as string);

    const updatedCart = {
      ...cart,
      items: (cart.items as CartItem[]).filter((cartItem) => cartItem.id !== item.id),
    };

    setCart({
      ...updatedCart,
      total: (updatedCart as CartResponse).items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    });
  };

  return (
    <li className="cartItem">
      <div className="cartItemDetail">
        <h3>{item.name}</h3>
        <p>Price: ${item.price}</p>
        <p>
          Quantity:
          <input
            type="number"
            min={1}
            max={5}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            onBlur={() => handleQuantityChange()}
          />
        </p>
        <p>Total: ${total.toFixed(2)}</p>
        <button onClick={onRemoveItem}>Remove</button>
      </div>
    </li>
  );
};

export default CartItemComponent;
