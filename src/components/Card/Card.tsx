import "./Card.css";
import DefaultItemImage from "../../assets/default-item-image.jpg";
import HeartIcon from "../../assets/heart-regular.svg";
import AddToCart from "../../assets/add-to-cart.png";
import AddedToCart from "../../assets/added-to-cart.png";
import FillHeartIcon from "../../assets/heart-solid.svg";
import { useContext, useEffect, useState } from "react";
import { SellerItem, WishlistItem } from "../../types/item";
import { CustomerProfile, SellerInfo, User, UserRole } from "../../types/user";
import { cartApi, customerApi } from "../../api-helpers";
import { UserContext } from "../../contexts/UserContext";
import { WishlistContext } from "../../contexts/WishlistContext";
import { CartContext } from "../../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

interface CardProps {
  item: SellerItem | WishlistItem;
  seller?: SellerInfo;
}

const Card: React.FC<CardProps> = ({ item, seller }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { wishlist, setWishlist } = useContext(WishlistContext);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const { setCart } = useContext(CartContext);
  const [disabledAddToCart, setDisabledAddToCart] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAddedToWishlist(
        (((user as User).profile as CustomerProfile).wishlist ?? []).includes(item.id)
      );
    }

    const { isAvailable, quantity } = item as SellerItem;

    if (!isAvailable || quantity < 1) {
      const addToCartButton = document.querySelector(`#I${item.id}`) as HTMLImageElement;
      addToCartButton.style.cursor = "not-allowed";
      addToCartButton.title = "Out of Stock";
      setDisabledAddToCart(true);
    }
  }, [wishlist]);

  const handleWishlistUpdate = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const loggedInError =
        "You have to be logged in as a customer to add an item to your wishlist.";

      if (!user || (user ?? {}).role !== UserRole.CUSTOMER) {
        throw new Error(loggedInError);
      }

      if (isAddedToWishlist) {
        const response = await customerApi.removeItemFromWishlist(item.id, accessToken as string);
        if (!response.status) {
          throw new Error(loggedInError);
        }

        const updatedUserWishlist = (user.profile as CustomerProfile).wishlist.filter(
          (itemId) => itemId !== item.id
        );
        setUser({
          ...user,
          profile: { ...user.profile, wishlist: updatedUserWishlist },
        });

        if (wishlist.length > 0) {
          const updatedWishlist = wishlist.filter((wishlistItem) => wishlistItem.id !== item.id);
          setWishlist(updatedWishlist);
        }
      } else {
        const response = await customerApi.addItemToWishlist(item.id, accessToken as string);
        if (!response.status) {
          throw new Error(loggedInError);
        }

        const updatedUserWishlist = (user.profile as CustomerProfile).wishlist ?? [];
        updatedUserWishlist.push(item.id);
        setUser({
          ...user,
          profile: { ...user.profile, wishlist: updatedUserWishlist },
        });

        const updatedWishlist = wishlist;
        updatedWishlist.push(item);
        setWishlist(updatedWishlist);
      }
    } catch (error) {
      alert(error);
      return;
    }

    setIsAddedToWishlist(!isAddedToWishlist);
  };

  const handleAddToCart = async () => {
    if (disabledAddToCart) {
      return;
    }

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

      const addToCartImage = document.querySelector(`#I${item.id}`) as HTMLImageElement;
      addToCartImage.src = AddedToCart;
      setDisabledAddToCart(true);

      const cartResponse = await cartApi.getCart(accessToken);

      if (cartResponse.data) {
        setCart(cartResponse.data);
      }

      setTimeout(() => {
        addToCartImage.src = AddToCart;
        setDisabledAddToCart(false);
      }, 200);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <img
          className="item-image"
          src={item.imageUrl || DefaultItemImage}
          alt={item.name}
          title="Click to view item details"
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
          onClick={() => {
            navigate(`/items/${item.id}`, { state: item });
          }}
        />
        {seller && (
          <p className="text-card">
            <Link to={`/sellers/${seller.id}`}>{seller.name}</Link>
          </p>
        )}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/items/${item.id}`, { state: item });
          }}
        >
          <p className="text-card">
            <b>{item.name}</b>
          </p>
          <p className="text-card">${item.price.toFixed(2)}</p>
        </div>
        <div className="icon-group">
          <div>
            <img
              className="icon"
              src={isAddedToWishlist ? FillHeartIcon : HeartIcon}
              alt={isAddedToWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              title={isAddedToWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              onClick={handleWishlistUpdate}
            />
          </div>
          <div>
            <img
              id={`I${item.id}`}
              className="icon"
              src={AddToCart}
              alt="Add to Cart"
              title="Add to Cart"
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
