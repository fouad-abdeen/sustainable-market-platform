import "./Seller.css";
import DefaultSellerLogo from "../../assets/default-seller-image.jpg";
import { useEffect, useState } from "react";
import { SellerItem } from "../../types/item";
import { SellerInfo } from "../../types/user";
import { itemApi, sellerApi } from "../../api-helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemCategoryResponse } from "../../types/api-responses";
import Card from "../../components/Card/Card";

const Seller = () => {
  const location = useLocation();
  const [seller, setSeller] = useState<SellerInfo>({} as SellerInfo);
  const [sellerItems, setSellerItems] = useState<SellerItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SellerItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemCategories, setItemCategories] = useState<ItemCategoryResponse[]>([]);

  useEffect(() => {
    (async () => {
      const sellerId = window.location.href.split("sellers/").pop() as string;
      let foundSeller = location.state as SellerInfo;

      if (!foundSeller) {
        try {
          const response = await sellerApi.queryOne(sellerId);

          if (!response.data) {
            throw new Error("The seller is not available. Please try again later.");
          }

          foundSeller = response.data;
        } catch (error) {
          alert(error);
          return;
        }
      }

      setSeller(foundSeller);

      if (itemCategories.length === 0) {
        const response = await sellerApi.getItemCategories(sellerId);

        if (response.data) {
          setItemCategories(response.data);
        }
      }

      if (sellerItems.length === 0) {
        const itemsResponse = await itemApi.getItems({ sellerId, isAvailable: true });
        const items = itemsResponse.data
          .filter((item) => (foundSeller.itemCategories ?? []).includes(item.categoryId))
          .sort((a, b) => a.name.localeCompare(b.name));
        setSellerItems(items);
        setFilteredItems(items);
      }

      setSeller(foundSeller);
    })();
  }, []);

  const handleCategorySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;

    setSelectedCategory(categoryId);

    setFilteredItems(
      categoryId ? sellerItems.filter((seller) => seller.categoryId === categoryId) : sellerItems
    );
  };

  return (
    <div className="seller">
      <div className="seller-profile">
        <h2>{seller.name}</h2>
        <p className="seller-description">{seller.description}</p>
        <div className="profile-fields">
          <div>
            <p className="contact-info">Phone: {seller.phoneNumber ?? "Unavailable"}</p>
            <p className="contact-info">Email: {seller.businessEmail ?? "Unavailable"}</p>
            <p className="contact-info">Address: {seller.address ?? "Unavailable"}</p>
          </div>
          <div>
            <img
              src={seller.logoUrl || DefaultSellerLogo}
              alt="Seller Logo"
              className="seller-logo"
            />
            <p>{seller.categoryName}</p>
          </div>
        </div>
      </div>
      <h2>Items</h2>
      <div className="filter">
        <label>Filter by Category: </label>
        <select value={selectedCategory} onChange={handleCategorySelection}>
          <option value="">All</option>
          {itemCategories &&
            itemCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>
      <ul className="sellerItemsList">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <Card key={item.id} item={item} />)
        ) : (
          <p>No items available.</p>
        )}
      </ul>
    </div>
  );
};

export default Seller;
