import "./SellerItem.css";
import React, { useEffect, useState } from "react";
import SellerItemDetail from "../SellerItemDetail/SellerItemDetail";
import { SellerItem as Item } from "../../types/item";
import { Category } from "../../types/category";
import { categoryApi, itemApi, sellerApi } from "../../api-helpers";
import { SellerItemUpdateRequest } from "../../types/api-requests";
import { SellerInfo, UserRole } from "../../types/user";
import { ItemCategoryResponse } from "../../types/api-responses";

interface SellerItemProps {
  userRole: string;
  seller: SellerInfo;
  itemCategories: Category[];
  item: Item;
  onUpdate: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

const SellerItem: React.FC<SellerItemProps> = ({
  userRole,
  seller,
  itemCategories,
  item,
  onUpdate,
  onDelete,
}) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedItem, setUpdatedItem] = useState<SellerItemUpdateRequest>({} as Item);
  const [category, setCategory] = useState({} as Category);
  const [categories, setCategories] = useState<ItemCategoryResponse[]>([]);

  useEffect(() => {
    const { id, ...currentItem } = item;

    setUpdatedItem({ ...currentItem });

    (async () => {
      try {
        const response = await categoryApi.getCategoryById(item.categoryId);

        if (response.data) {
          setCategory(response.data);
        }
      } catch (error) {
        return;
      }
    })();
  }, []);

  const handleViewDetail = () => {
    setIsDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
  };

  const handleUpdate = async () => {
    if (userRole === UserRole.ADMIN) {
      try {
        const response = await sellerApi.getItemCategories(seller.id);

        if (!response.data) {
          throw new Error("Failed to get item categories of the item's seller");
        }

        setCategories(response.data);
      } catch (error) {
        alert(error);
      }
    }

    setIsEditing(true);
  };

  const updateItem = async () => {
    if (!confirm("Are you sure you want to update this item?")) {
      return;
    }

    try {
      const response = await itemApi.updateItem(
        item.id,
        updatedItem,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        throw new Error("You have to be logged in as a seller or admin to update an item");
      }

      if (!response.data) {
        throw new Error("Something went wrong. Please try again later");
      }

      const categoryResponse = await categoryApi.getCategoryById(response.data.categoryId);

      onUpdate(response.data);
      setCategory(categoryResponse.data);
      item = { ...response.data };
    } catch (error) {
      alert(error);
      return;
    }

    setIsEditing(false);
  };

  const deleteItem = () => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    (async () => {
      try {
        const response = await itemApi.deleteItem(
          item.id,
          localStorage.getItem("accessToken") as string
        );

        if (!response.status) {
          throw new Error("You have to be logged in as a seller to delete an item");
        }

        onDelete(item.id);
      } catch (error) {
        alert(error);
        return;
      }
    })();
  };

  return (
    <>
      <li className={`seller-item ${isEditing ? "editing" : ""}`}>
        {isEditing ? (
          <form>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={updatedItem.name}
                onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={updatedItem.description}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={updatedItem.price}
                onChange={(e) => setUpdatedItem({ ...updatedItem, price: +e.target.value })}
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                className="form-input"
                value={updatedItem.categoryId}
                onChange={(e) => setUpdatedItem({ ...updatedItem, categoryId: e.target.value })}
              >
                {(userRole === UserRole.ADMIN ? categories : itemCategories).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                value={updatedItem.quantity}
                onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: +e.target.value })}
              />
            </div>
            <div>
              <label>Is Available:</label>
              <input
                type="checkbox"
                checked={updatedItem.isAvailable}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    isAvailable: e.target.checked,
                  })
                }
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={updatedItem.imageUrl}
                onChange={(e) => setUpdatedItem({ ...updatedItem, imageUrl: e.target.value })}
              />
            </div>
          </form>
        ) : (
          <div>
            <h3>{item.name}</h3>
            {userRole === UserRole.ADMIN && <p>Seller: {seller.name}</p>}
            <p>Price: ${item.price}</p>
            <p>
              Category:
              {category.name === "All" ? (
                <span style={{ color: "#dc3545", fontSize: "16px" }}>
                  {userRole === UserRole.ADMIN
                    ? " Item has no category and is not displayed on the seller's public page"
                    : " Your item has no category and will not be displayed on your public page." +
                      " Update the category once we assign you the needed item categories for your profile." +
                      " Please get in touch with us if needed."}
                </span>
              ) : (
                category.name
              )}
            </p>
          </div>
        )}
        <div className="actions" style={{ marginLeft: "100px" }}>
          {isEditing ? (
            <>
              <button className="button primary-button" onClick={updateItem}>
                Save
              </button>
              <button className="button primary-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="button primary-button" onClick={handleViewDetail}>
                View
              </button>
              <button className="button primary-button" onClick={handleUpdate}>
                Update
              </button>
              {userRole === UserRole.SELLER && (
                <button className="button danger-button" onClick={deleteItem}>
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </li>
      {isDetailVisible && (
        <div className="overlay">
          <SellerItemDetail item={item} category={category} onClose={handleCloseDetail} />
        </div>
      )}
    </>
  );
};

export default SellerItem;
