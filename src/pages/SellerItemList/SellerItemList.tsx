import "./SellerItemList.css";
import { useContext, useEffect, useState } from "react";
import SellerItemComponent from "../../components/SellerItem/SellerItem";
import { SellerItemResponse } from "../../types/api-responses";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { SellerInfo, SellerProfile, User, UserRole } from "../../types/user";
import { categoryApi, itemApi, sellerApi } from "../../api-helpers";
import { SellerItemCreateRequest } from "../../types/api-requests";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { Category } from "../../types/category";
import { SellerItem } from "../../types/item";

const SellerItemList: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SellerItemCreateRequest>({} as SellerItemCreateRequest);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [sellers, setSellers] = useState<SellerInfo[]>([]);
  const [items, setItems] = useState<SellerItemResponse[]>([]);
  const [filteredItems, setFilteredItems] = useState<SellerItemResponse[]>([]);
  const [itemCategories, setItemCategories] = useState<Category[]>([]);
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(UserContext);

  const defaultFormData = {
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    quantity: 9999999,
    isAvailable: true,
    imageUrl: undefined,
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/");
      return;
    }

    let defaultCategory = categories.find((category) => category.name === "All");

    if (!defaultCategory) {
      (async () => {
        const response = await categoryApi.getDefaultItemCategory();
        defaultCategory = response.data ?? ({} as Category);
      })();
    }

    if (user) {
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SELLER) {
        navigate("/");
        return;
      }

      if (user.role === UserRole.SELLER && categories.length > 0) {
        const assignedItemCategories = ((user.profile as SellerProfile).itemCategories ?? []).map(
          (categoryId) =>
            categories.find((category) => category.id === categoryId) ?? ({} as Category)
        );

        setItemCategories(
          assignedItemCategories.length > 0 ? assignedItemCategories : [defaultCategory as Category]
        );

        if (Object.keys(formData).length === 0) {
          setFormData({
            ...defaultFormData,
            categoryId: (assignedItemCategories[0] ?? (defaultCategory as Category)).id,
            sellerId: "",
          });
        }
      }
    }

    (async () => {
      try {
        if (user) {
          if (user.role === UserRole.ADMIN && sellers.length === 0) {
            const sellersResponse = await sellerApi.query({});

            if (sellersResponse.data) {
              setSellers(sellersResponse.data);
            }
          }

          if (items.length === 0) {
            const params = user.role === UserRole.SELLER ? { sellerId: user.id } : {};
            const response = await itemApi.getItems(params);

            if (!response.status) {
              navigate("/");
              return;
            }

            if (response.data) {
              setItems(response.data);
              setFilteredItems(response.data);
            }
          }
        }
      } catch (error) {
        return;
      }
    })();
  }, [categories, user]);

  const addItem = async () => {
    const accessToken = localStorage.getItem("accessToken") as string;

    try {
      const response = await itemApi.createItem(
        { ...formData, sellerId: (user as User).id },
        accessToken
      );

      if (!response.status) {
        throw new Error("You have to be logged in as a seller to create an item");
      }

      if (!response.data) {
        throw new Error("Failed to create the item. Please try again later.");
      }

      setItems([...items, response.data]);
      setFormData({
        ...defaultFormData,
        categoryId: itemCategories[0].id,
        sellerId: (user as User).id,
      });
      setShowForm(false);
    } catch (error) {
      alert(error);
    }
  };

  const onUpdate = (item: SellerItemResponse) => {
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

    updatedItems[itemIndex] = item;
    setItems(updatedItems);

    if ((user ?? ({} as User)).role === UserRole.ADMIN) {
      setFilteredItems(
        selectedSeller
          ? updatedItems.filter((item: SellerItem) => item.sellerId === selectedSeller)
          : updatedItems
      );
    }
  };

  const onDelete = (itemId: string) => {
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((i) => i.id === itemId);

    updatedItems.splice(itemIndex, 1);
    setItems(updatedItems);
  };

  const handleSellerSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seller = event.target.value;

    setSelectedSeller(seller);

    if (seller) {
      setFilteredItems(items.filter((item: SellerItem) => item.sellerId === seller));
    } else {
      setFilteredItems(items);
    }
  };

  return (
    <div className="seller-item-list">
      <h2>{(user ?? {}).role === UserRole.SELLER ? "My Items" : "Sellers' Items"}</h2>

      {(user ?? {}).role === UserRole.SELLER &&
        (showForm ? (
          <>
            <form className="add-item-form">
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <label>Price:</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
              />
              <label>Category:</label>
              <select
                className="form-input"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {itemCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label>Quantity:</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: +e.target.value })}
              />
              <label>Is Available:</label>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              <label>Image URL:</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </form>
            <div className="add-item-buttons">
              <button className="button primary-button" onClick={addItem}>
                Save
              </button>
              <button className="button primary-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="add-item-buttons">
            <button className="button primary-button" onClick={() => setShowForm(true)}>
              Add Item
            </button>
          </div>
        ))}

      {(user ?? {}).role === UserRole.ADMIN && (
        <div className="filter">
          <label>Filter by Seller:</label>
          <select className="form-input" value={selectedSeller} onChange={handleSellerSelection}>
            <option value="">All</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <ul>
        {((user ?? {}).role === UserRole.ADMIN ? filteredItems : items).map((item) => (
          <SellerItemComponent
            key={item.id}
            userRole={(user ?? { role: "" }).role}
            seller={sellers.find((seller) => seller.id === item.sellerId) ?? ({} as SellerInfo)}
            itemCategories={itemCategories}
            item={item}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default SellerItemList;
