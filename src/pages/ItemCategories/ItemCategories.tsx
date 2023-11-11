import "./ItemCategories.css";
import { Link, useNavigate } from "react-router-dom";
import { categoryApi, sellerApi } from "../../api-helpers";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { Category, CategoryType } from "../../types/category";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { SellerInfo, UserRole } from "../../types/user";

function ItemCategories() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<SellerInfo[]>([]);
  const { categories, setCategories } = useContext(CategoriesContext);
  const [itemCategories, setItemCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [updateFormData, setUpdateFormData] = useState<{
    [categoryId: string]: Category;
  }>({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/");
    }

    if (user) {
      if (user.role !== UserRole.ADMIN) {
        navigate("/");
      }
    }

    if (sellers.length === 0) {
      (async () => {
        const response = await sellerApi.query({});

        if (response.data) {
          setSellers(response.data);
        }
      })();
    }

    setItemCategories(
      categories.filter(
        (category) => category.type === CategoryType.ITEM && category.name !== "All"
      )
    );
  }, [user, categories]);

  const createCategory = async () => {
    try {
      const response = await categoryApi.createCategory(
        {
          name: newCategoryName,
          type: CategoryType.ITEM,
        },
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        throw new Error("You have to be logged in as an admin to create a category.");
      }

      if (!response.data) {
        alert("Something went wrong. Please try again later.");
        return;
      }

      setCategories([...itemCategories, response.data]);
      setNewCategoryName("");
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdate = (category: Category) => {
    setUpdateFormData({
      ...updateFormData,
      [category.id]: category,
    });

    const categoryData = document.getElementById(`category-data-${category.id}`) as HTMLDivElement;
    const updateForm = document.getElementById(`update-form-${category.id}`) as HTMLDivElement;
    const updateButton = document.getElementById(
      `update-button-${category.id}`
    ) as HTMLButtonElement;
    const submitButton = document.getElementById(
      `submit-button-${category.id}`
    ) as HTMLButtonElement;

    categoryData.style.display = "none";
    updateForm.style.display = "block";
    updateButton.style.display = "none";
    submitButton.style.display = "block";
  };

  const handleCategoryFieldChange = (
    categoryId: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUpdateFormData({
      ...updateFormData,
      [categoryId]: {
        ...(updateFormData[categoryId] ?? {}),
        [event.target.name]: event.target.value,
      },
    });
  };

  const updateCategory = async (categoryId: string) => {
    const category = updateFormData[categoryId];

    try {
      const response = await categoryApi.updateCategory(
        categoryId,
        category,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        alert("You have to be logged in as an admin to update a category.");
        return;
      }

      if (!response.data) {
        alert("Something went wrong. Please try again later.");
        return;
      }

      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return response.data;
          }

          return category;
        })
      );
    } catch (error) {
      alert(error);
      return;
    }

    const categoryData = document.getElementById(`category-data-${categoryId}`) as HTMLDivElement;
    const updateForm = document.getElementById(`update-form-${categoryId}`) as HTMLDivElement;
    const updateButton = document.getElementById(
      `update-button-${categoryId}`
    ) as HTMLButtonElement;
    const submitButton = document.getElementById(
      `submit-button-${categoryId}`
    ) as HTMLButtonElement;

    categoryData.style.display = "block";
    updateForm.style.display = "none";
    updateButton.style.display = "block";
    submitButton.style.display = "none";
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await categoryApi.deleteCategory(
        categoryId,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        throw new Error("You have to be logged in as an admin to delete a category.");
      }

      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="categories-admin-container">
      <h2 className="categories-admin-title">Item Categories</h2>

      <div className="create-category-form">
        <h3 style={{ fontSize: "20px", color: "#333333" }}>Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          name="name"
          value={newCategoryName}
          onChange={(event) => {
            setNewCategoryName(event.target.value);
          }}
          className="category-input"
        />
        <button onClick={createCategory} className="create-category-button">
          Submit
        </button>
      </div>

      <ul className="categories-list">
        {itemCategories.map((category) => (
          <li key={category.id}>
            <div
              style={{ marginLeft: "50px", marginRight: "50px" }}
              id={`category-data-${category.id}`}
            >
              <p>
                <strong>Name: {category.name}</strong>
              </p>
              <p>
                Assigned to the Sellers:{" "}
                {(() => {
                  const filteredSellers = sellers.filter((seller) =>
                    (seller.itemCategories ?? []).includes(category.id)
                  );

                  if (filteredSellers.length > 0) {
                    return filteredSellers.map((seller, index) => {
                      return (
                        <span key={seller.id}>
                          <Link to={`/sellers/${seller.id}`} className="link-to-seller">
                            {` ${seller.name}`}
                            {filteredSellers[index + 1] ? "," : "."}
                          </Link>
                        </span>
                      );
                    });
                  }

                  return <span style={{ color: "#dd4a48" }}>None.</span>;
                })()}
              </p>
            </div>

            <div style={{ display: "none", marginRight: "50px" }} id={`update-form-${category.id}`}>
              <label htmlFor={`name-${category.id}`}>Name</label>
              <input
                type="text"
                placeholder="Category Name"
                id={`name-${category.id}`}
                name="name"
                value={(updateFormData[category.id] ?? {}).name ?? ""}
                onChange={(e) => handleCategoryFieldChange(category.id, e)}
                className="category-input"
              />
            </div>

            <div>
              <button
                onClick={() => handleUpdate(category)}
                className="update-category-button"
                id={`update-button-${category.id}`}
              >
                Update
              </button>
              <button
                style={{ display: "none" }}
                onClick={() => updateCategory(category.id)}
                className="update-category-button"
                id={`submit-button-${category.id}`}
              >
                Submit
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="delete-category-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemCategories;
