import "./Item.css";
import DefaultItemImage from "../../assets/default-item-image.jpg";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { SellerItem } from "../../types/item";
import { cartApi, itemApi } from "../../api-helpers";
import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../types/user";

const Item: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [item, setItem] = useState<SellerItem>({} as SellerItem);
  const [quantity, setQuantity] = useState(1);
  const { setCart } = useContext(CartContext);

  useEffect(() => {
    if (location.state) {
      setItem(location.state);
      checkItemAvailability(location.state);
      return;
    }

    (async () => {
      try {
        const response = await itemApi.getItemById(params.id ?? "");

        if (response.data) {
          setItem(response.data);
          checkItemAvailability(response.data);
          return;
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, []);

  const checkItemAvailability = (item: SellerItem): void => {
    if (item.isAvailable && item.quantity >= 1) {
      return;
    }

    const quantityInput = document.querySelector(`#quantity`) as HTMLInputElement;
    const addToCartButton = document.querySelector(`#add-to-cart`) as HTMLButtonElement;

    quantityInput.disabled = true;
    addToCartButton.disabled = true;
    addToCartButton.innerHTML = "Out of Stock";
    addToCartButton.style.cursor = "not-allowed";
    addToCartButton.style.backgroundColor = "gray";
  };

  const handleAddToCart = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") as string;
      const loggedInError = "You have to be logged in as a customer to add an item to your cart.";

      if (!user || (user ?? {}).role !== UserRole.CUSTOMER) {
        throw new Error(loggedInError);
      }

      const response = await cartApi.addItemToCart({ id: item.id, quantity: 1 }, accessToken);

      if (!response.status) {
        throw new Error(loggedInError);
      }

      const addToCartButton = document.querySelector(`#add-to-cart`) as HTMLButtonElement;
      addToCartButton.disabled = true;
      addToCartButton.innerHTML = "Added to Cart";
      addToCartButton.style.cursor = "not-allowed";

      const cartResponse = await cartApi.getCart(accessToken);

      if (cartResponse.data) {
        setCart(cartResponse.data);
      }

      setTimeout(() => {
        addToCartButton.disabled = false;
        addToCartButton.innerHTML = "Add to Cart";
        addToCartButton.style.cursor = "pointer";
      }, 500);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="item-detail">
      <div className="item-image">
        <img src={item.imageUrl ?? DefaultItemImage} alt={item.name} />
      </div>
      <div className="item-info">
        <h1>{item.name}</h1>
        <p className="item-description">{item.description}</p>
        <p className="item-price">${item.price}</p>
        <div className="add-to-cart-container">
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={5}
          />
          <button
            id={`add-to-cart`}
            className={`add-to-cart`}
            disabled={quantity > 5}
            onClick={handleAddToCart}
          >
            {/* {quantity > item.quantity ? "Out of Stock" : "Add to Cart"} */}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
