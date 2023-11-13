import "./SellerList.css";
import DefaultSellerLogo from "../../assets/default-seller-image.jpg";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { SellersContext } from "../../contexts/SellersContext";
import { Category, CategoryType } from "../../types/category";
import { SellerInfo } from "../../types/user";

function SellerList() {
  const { sellers } = useContext(SellersContext);
  const { categories } = useContext(CategoriesContext);
  const [filteredSellers, setFilteredSellers] = useState<SellerInfo[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setServiceCategories(categories.filter((category) => category.type === CategoryType.SERVICE));
    }

    setFilteredSellers(sellers.sort((a, b) => a.name.localeCompare(b.name)));
  }, [categories, sellers]);

  const handleCategorySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;

    setSelectedCategory(categoryId);

    setFilteredSellers(
      categoryId ? sellers.filter((seller) => seller.categoryId === categoryId) : sellers
    );
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <h2>Our Sellers</h2>

      <div className="filter">
        <label htmlFor="category">Filter by Category:</label>
        <select
          name="category"
          id="category"
          value={selectedCategory}
          onChange={handleCategorySelection}
        >
          <option value="">All</option>
          {serviceCategories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="seller-container">
        {filteredSellers
          .filter((seller) => seller.itemsCount ?? 0 > 0)
          .map((seller) => {
            const categoryName = (
              serviceCategories.find((category) => category.id === seller.categoryId) ?? {}
            ).name;
            return (
              <div className="seller-block" key={seller.id}>
                <Link
                  to={seller.id}
                  state={{ ...seller, categoryName }}
                  title="Click to view seller details"
                >
                  <img src={seller.logoUrl || DefaultSellerLogo} alt={seller.name} />{" "}
                  <h2 className="seller-title">{seller.name}</h2>
                  <p className="seller-category">{categoryName}</p>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default SellerList;
