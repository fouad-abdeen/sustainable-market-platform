import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { authApi, refreshAccessToken } from "../../api-helpers";
import { UserRole } from "../../types/user";
import { UserContext } from "../../contexts/UserContext";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import Visible from "../../assets/icon-visible.png";
import { SignupRequest } from "../../types/api-requests";

function SignUp() {
  const { setUser } = useContext(UserContext);
  const [userRole, setUserRole] = useState(UserRole.CUSTOMER);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    sellerName: "",
    categoryId: "",
  });
  const { categories } = useContext(CategoriesContext);
  const [serviceCategories, setServiceCategories] = useState(categories);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const listOfServiceCategories = categories.filter((category) => category.type === "Service");

    setServiceCategories(listOfServiceCategories);

    if (listOfServiceCategories[0]) {
      setFormData({ ...formData, categoryId: listOfServiceCategories[0].id });
    }

    (async () => {
      try {
        const authenticated = await refreshAccessToken(
          localStorage.getItem("accessToken") as string,
          localStorage.getItem("refreshToken") as string
        );
        if (authenticated) navigate("/");
      } catch (error) {
        return;
      }
    })();
  }, [categories]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handkeUserRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserRole(event.target.value as UserRole);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const data = { ...formData, role: userRole } as SignupRequest;

      if (userRole === UserRole.CUSTOMER) {
        delete data.sellerName;
        delete data.categoryId;
      } else {
        delete data.firstName;
        delete data.lastName;
      }

      const response = await authApi.signup(data);

      setUser(response.data.userInfo);

      const { accessToken, refreshToken } = response.data.tokens;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("previouslyAuthenticated", "true");

      alert(
        "Signed up successfully! We sent you a mail to verify your email address. " +
          "Please verify your email within 24 hours to access all features on the platform."
      );
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="main">
        <div className="image-container"></div>
        <div className="form-container">
          <div className="new-user">
            Already have an account?
            <Link to="/signin">
              <span className="sign-up-link"> Sign In </span>
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <h2>Welcome at Sustainable Market</h2>
            <div className="form-group">
              <label htmlFor="userRole">Sign Up As:</label>
              <select
                name="userRole"
                className="form-input"
                value={userRole}
                onChange={handkeUserRoleChange}
                required
              >
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group password-input-container">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="signup-show-password-button" onClick={togglePasswordVisibility}>
                <img
                  src={Visible}
                  alt="Show Password"
                  className={`visible ${showPassword ? "icon" : ""}`}
                />
              </span>
            </div>
            {userRole === UserRole.CUSTOMER ? (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="name">Business Name</label>
                  <input
                    type="text"
                    name="sellerName"
                    placeholder="Business Name"
                    className="form-input"
                    value={formData.sellerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    name="categoryId"
                    className="form-input"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    {serviceCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <button className="form-input submit-button" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
