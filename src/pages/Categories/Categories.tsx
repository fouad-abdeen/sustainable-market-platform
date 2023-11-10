import "./Categories.css";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api-helpers";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { Category, CategoryType } from "../../types/category";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../types/user";

function Categories() {
  const navigate = useNavigate();
  const { categories, setCategories } = useContext(CategoriesContext);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [createFormData, setCreateFormData] = useState<Category>({} as Category);
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

    setFilteredCategories(categories);
  }, [user]);

  const handleNewCategoryFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };

  const createCategory = async () => {
    try {
      const response = await categoryApi.createCategory(
        createFormData,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        throw new Error("You have to be logged in as an admin to create a category.");
      }

      if (!response.data) {
        alert("Something went wrong. Please try again later.");
        return;
      }

      setCategories([...categories, response.data]);
      setCreateFormData({} as Category);
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

      setCategories(categories.filter((caetegory) => caetegory.id !== categoryId));
    } catch (error) {
      alert(error);
    }
  };

  const handleTypeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryType = event.target.value as CategoryType;

    setSelectedCategory(categoryType);

    if (categoryType) {
      setFilteredCategories(
        categories.filter((category: Category) => category.type === categoryType)
      );
    } else {
      setFilteredCategories(categories);
    }
  };

  return (
    <div className="categories-admin-container">
      <h2 className="categories-admin-title">Categories</h2>

      <div className="filter">
        <label htmlFor="type">Filter by Type:</label>
        <select
          name="type"
          value={selectedCategory}
          onChange={handleTypeSelection}
          className="category-input"
        >
          <option value="">All</option>
          <option value="Item">Item</option>
          <option value="Service">Service</option>
        </select>
      </div>

      <div className="create-category-form">
        <h3 style={{ fontSize: "20px", color: "#333333" }}>Create Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          name="name"
          value={createFormData.name ?? ""}
          onChange={handleNewCategoryFieldChange}
          className="category-input"
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={createFormData.description ?? ""}
          onChange={handleNewCategoryFieldChange}
          className="category-input"
        />
        <select
          name="type"
          value={createFormData.type ?? ""}
          onChange={handleNewCategoryFieldChange}
          className="category-input"
        >
          <option value="">Select Type</option>
          <option value="Item">Item</option>
          <option value="Service">Service</option>
        </select>
        <button onClick={createCategory} className="create-category-button">
          Create
        </button>
      </div>

      <ul className="categories-list">
        {filteredCategories.map((category) => (
          <li key={category.id}>
            <div style={{ margin: "auto" }} id={`category-data-${category.id}`}>
              <strong>Name: {category.name}</strong>
              <p>Description: {category.description}</p>
              <p>Type: {category.type}</p>
            </div>
            <div style={{ display: "none" }} id={`update-form-${category.id}`}>
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
              <label htmlFor={`description-${category.id}`}>Description</label>
              <input
                type="text"
                placeholder="Description"
                id={`description-${category.id}`}
                name="description"
                value={(updateFormData[category.id] ?? {}).description ?? ""}
                onChange={(e) => handleCategoryFieldChange(category.id, e)}
                className="category-input"
              />
              <label htmlFor={`type-${category.id}`}>Type</label>
              <select
                id={`type-${category.id}`}
                name="type"
                value={(updateFormData[category.id] ?? {}).type ?? ""}
                onChange={(e) => handleCategoryFieldChange(category.id, e)}
                className="category-input"
              >
                <option value="Item">Item</option>
                <option value="Service">Service</option>
              </select>
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

export default Categories;
