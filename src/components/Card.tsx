import "./Card.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faCartPlus,
  faHeart as faFilledHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Item } from "../types/item";

function Card(item: Item) {
  const [isAddedToFavorite, setIsAddedToFavorite] = useState<boolean>(
    item.favorite
  );
  const [addedToShoppingCart, setAddedToShoppingCart] =
    useState<boolean>(false);

  const handleAddToShoppingCart = () => {
    setAddedToShoppingCart(true);
    setTimeout(() => {
      setAddedToShoppingCart(false);
    }, 500);
  };

  return (
    <>
      <div className="card">
        <div className="card-image">
          <img src={item.image} />
        </div>
        <p className="card-text">{item.name}</p>
        <p className="card-text">{item.description}</p>
        <p className="card-text">$ {item.price}</p>
        <div className="icon-group">
          <div>
            <FontAwesomeIcon
              className="icon"
              icon={isAddedToFavorite ? faFilledHeart : faHeart}
              onClick={() => setIsAddedToFavorite(!isAddedToFavorite)}
            />
          </div>
          <div>
            <FontAwesomeIcon
              className="icon"
              icon={addedToShoppingCart ? faCartArrowDown : faCartPlus}
              onClick={() => handleAddToShoppingCart()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
