import "./SellerItemDetail.css";
import DefaultItemImage from "../../assets/default-item-image.jpg";
import React from "react";
import { MenuItem } from "../../types/item";
import { Category } from "../../types/category";

interface SellerItemDetailProps {
  item: MenuItem;
  category: Category;
  onClose: () => void;
}

const SellerItemDetail: React.FC<SellerItemDetailProps> = ({ item, category, onClose }) => {
  return (
    <div className="seller-item-detail">
      <div className="seller-item-image">
        <img src={item.imageUrl ?? DefaultItemImage} alt={item.name} />
      </div>
      <div className="seller-item-info">
        <h2>{item.name}</h2>
        <p>Description: {item.description}</p>
        <p>Price: ${item.price.toFixed(2)}</p>
        <p>Category: {category.name}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Available: {item.isAvailable ? "Yes" : "No"}</p>
        <button className="button primary-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SellerItemDetail;
