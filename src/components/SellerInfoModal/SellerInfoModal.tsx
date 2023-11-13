import "./SellerInfoModal.css";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SellerProfile } from "../../types/user";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { CategoryResponse } from "../../types/api-responses";
import { CategoryType } from "../../types/category";
import { sellerApi } from "../../api-helpers";

interface SellerInfoModalProps {
  sellerId: string;
  sellerInfo: SellerProfile;
  onClose: (sellerId: string) => void;
}

const SellerInfoModal: React.FC<SellerInfoModalProps> = ({ sellerId, sellerInfo, onClose }) => {
  const { categories } = useContext(CategoriesContext);
  const [availableItemCategories, setAvailableItemCategories] = useState<CategoryResponse[]>([]);
  const [availableServiceCategories, setAvailableServiceCategories] = useState<CategoryResponse[]>(
    []
  );
  const [itemCategories, setItemCategories] = useState<CategoryResponse[]>([]);
  const [serviceCategory, setServiceCategory] = useState<CategoryResponse>({} as CategoryResponse);

  useEffect(() => {
    if (categories.length > 0) {
      const currentItemCategories = categories.filter(
        (category) => category.type === CategoryType.ITEM
      );

      setAvailableItemCategories(
        currentItemCategories.filter(
          (category) =>
            !(sellerInfo.itemCategories ?? []).includes(category.id) && category.name !== "All"
        )
      );

      setItemCategories(
        (sellerInfo.itemCategories ?? []).map((categoryId) => {
          const category = currentItemCategories.find((category) => category.id === categoryId);

          return category ?? ({} as CategoryResponse);
        })
      );

      setAvailableServiceCategories(
        categories.filter(
          (category) =>
            category.type === CategoryType.SERVICE && category.id !== sellerInfo.categoryId
        )
      );

      const category = categories.find((category) => category.id === sellerInfo.categoryId);

      if (category) {
        setServiceCategory(category);
      }
    }
  }, []);

  const updateServiceCategory = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = event.target.value;

    if (!confirm(`Are you sure you want to update ${sellerInfo.name}'s service category?`)) {
      return;
    }

    if (newCategoryId) {
      const accessToken = localStorage.getItem("accessToken") as string;

      try {
        const response = await sellerApi.updateCategory(sellerId, newCategoryId, accessToken);

        if (!response.status) {
          throw new Error("Failed to update service category");
        }
      } catch (error) {
        alert(error);
        return;
      }

      const newCategory = availableServiceCategories.find(
        (category) => category.id === newCategoryId
      );

      if (newCategory) {
        setAvailableServiceCategories([
          ...availableServiceCategories.filter((category) => category.id !== newCategoryId),
          serviceCategory,
        ]);
        setServiceCategory(newCategory);
      }
    }
  };

  const assignItemCategory = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = event.target.value;

    if (newCategoryId) {
      const accessToken = localStorage.getItem("accessToken") as string;

      try {
        const response = await sellerApi.assignItemCategory(sellerId, newCategoryId, accessToken);

        if (!response.status) {
          throw new Error("Failed to assign item category");
        }
      } catch (error) {
        alert(error);
        return;
      }

      const newCategory = availableItemCategories.find((category) => category.id === newCategoryId);

      if (newCategory) {
        setItemCategories([...itemCategories, newCategory]);
        setAvailableItemCategories(
          availableItemCategories.filter((category) => category.id !== newCategoryId)
        );
      }
    }
  };

  const removeItemCategory = async (categoryId: string) => {
    const accessToken = localStorage.getItem("accessToken") as string;

    try {
      const response = await sellerApi.removeItemCategory(sellerId, categoryId, accessToken);

      if (!response.status) {
        throw new Error("Failed to remove item category");
      }
    } catch (error) {
      alert(error);
      return;
    }

    const removedCategory = itemCategories.find((category) => category.id === categoryId);

    if (removedCategory) {
      setItemCategories(itemCategories.filter((category) => category.id !== categoryId));
      setAvailableItemCategories([...availableItemCategories, removedCategory]);
    }
  };

  return (
    <>
      <div id={`M${sellerId}`} className="modal">
        <div className="modal-content">
          <h4 className="close" onClick={(e) => onClose(sellerId)}>
            &times;
          </h4>

          <div style={{ width: "50%", margin: "auto" }}>
            <h3>Business Information</h3>
            <p>Name: {sellerInfo.name}</p>
            <p>Description: {sellerInfo.description}</p>
            <p>Email: {sellerInfo.businessEmail}</p>
            <p>Phone Number: {sellerInfo.phoneNumber}</p>
            <p>Address: {sellerInfo.address}</p>
            <label htmlFor={`service-category-${sellerId}`}>Service Category:</label>
            <select
              id={`service-category-${sellerId}`}
              className="form-input"
              value={serviceCategory.name}
              onChange={updateServiceCategory}
            >
              <option key={serviceCategory.id} value={serviceCategory.id}>
                {serviceCategory.name}
              </option>
              {availableServiceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <h2>Item Categories</h2>
          <div style={{ width: "50%", margin: "auto" }}>
            <div className="item-categories">
              <div className="item-categories-details" style={{ marginBottom: "25px" }}>
                <label htmlFor={`new-item-category-${sellerId}`}>Assign an Item Category:</label>
                <select
                  id={`new-item-category-${sellerId}`}
                  className="form-input"
                  value={""}
                  onChange={assignItemCategory}
                >
                  <option value={""}>Select a Category</option>
                  {availableItemCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {itemCategories.map((category, index) => (
                <div className="item-categories-details" key={category.id}>
                  <h4 className="item-categories-field">
                    {index + 1}. {category.name}
                  </h4>
                  <h4
                    style={{ cursor: "pointer" }}
                    onClick={(e) => removeItemCategory(category.id)}
                  >
                    &times;
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerInfoModal;
