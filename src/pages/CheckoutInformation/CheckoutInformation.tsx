import "./CheckoutInformation.css";
import React, { useContext, useEffect, useState } from "react";
import { CustomerProfile, User, UserRole } from "../../types/user";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { CheckoutContext } from "../../contexts/CheckoutContext";

const CheckoutInformation: React.FC = () => {
  const navigate = useNavigate();
  const [city] = useState("Tripoli");
  const { checkoutInfo, setCheckoutInfo } = useContext(CheckoutContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role !== UserRole.CUSTOMER) {
        navigate("/");
        return;
      }

      if (!checkoutInfo.firstName) {
        const { wishlist, ...profile } = user.profile as CustomerProfile;

        if (!checkoutInfo.firstName) {
          setCheckoutInfo({
            email: user.email,
            ...profile,
          });
        }
      }
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCheckoutInfo({
      ...checkoutInfo,
      [name]: value,
    });
  };

  return (
    <div className="Customer-information">
      <h2>Checkout Information</h2>
      <form>
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstName"
            value={checkoutInfo.firstName || ""}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastName"
            value={checkoutInfo.lastName || ""}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={checkoutInfo.phoneNumber || ""}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={city}
            required
            className="form-control"
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            name="address"
            value={checkoutInfo.address || ""}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <Link to="/checkout/confirmation">
          <button type="button" className="btn btn-primary">
            Confirm Checkout
          </button>
        </Link>
      </form>
    </div>
  );
};

export default CheckoutInformation;
