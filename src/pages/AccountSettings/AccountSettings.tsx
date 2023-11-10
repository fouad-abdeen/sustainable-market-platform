import React, { useContext, useEffect, useState } from "react";
import "./AccountSettings.css";
import { useNavigate } from "react-router-dom";
import PasswordChangePopup from "../../components/PasswordChangePopup/PasswordChangePopup";
import { camelCaseToTitleCase } from "../../utility-functions";
import { UserContext } from "../../contexts/UserContext";
import { CustomerProfile, SellerProfile, User, UserRole } from "../../types/user";
import { customerApi, sellerApi } from "../../api-helpers";

type UserProfile = CustomerProfile | SellerProfile;

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState<UserProfile>({} as UserProfile);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const customerProfileKeys = ["firstName", "lastName", "phoneNumber", "address"];
  const sellerProfileKeys = [
    "name",
    "description",
    "phoneNumber",
    "address",
    "businessEmail",
    "logoUrl",
    "websiteUrl",
  ];

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role === UserRole.CUSTOMER) {
        const { wishlist, ...profile } = user.profile as CustomerProfile;
        setFormData(profile as CustomerProfile);
      } else if (user.role === UserRole.SELLER) {
        const { categoryId, itemCategories, itemsCount, ...profile } =
          user.profile as SellerProfile;
        setFormData(profile as SellerProfile);
      }
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken") as string;

      const filteredFormData = { ...formData };

      Object.entries(formData).forEach(([key, value]) => {
        if (!value) {
          delete (filteredFormData as any)[key];
        }
      });

      const response = await ((user as User).role === UserRole.CUSTOMER
        ? customerApi
        : sellerApi
      ).updateProfile(formData, accessToken);

      if (!response.status) {
        throw new Error("You have to be logged in to update your profile");
      }

      setUser({
        ...user,
        profile: {
          ...(user as User).profile,
          ...formData,
        },
      } as User);

      navigate("/profile");
    } catch (error) {
      alert(error);
    }
  };

  const closePasswordPopup = () => {
    setShowPasswordPopup(false);
  };

  return (
    <>
      <div className="account-settings">
        <h2>Account Settings</h2>
        {user ? (
          <form onSubmit={handleSubmit}>
            {(user.role === UserRole.CUSTOMER
              ? customerProfileKeys
              : user.role === UserRole.SELLER
              ? sellerProfileKeys
              : []
            ).map((key) => {
              return (
                <div className="form-group" key={key}>
                  <label htmlFor={key}>{camelCaseToTitleCase(key)}</label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={(formData as any)[key] ?? ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
            <div className="form-group">
              {user.role !== UserRole.ADMIN && <button type="submit">Save</button>}
            </div>
            <div className="form-group">
              <button type="button" onClick={() => setShowPasswordPopup(true)}>
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <> </>
        )}
      </div>

      {user && showPasswordPopup && <PasswordChangePopup onClose={closePasswordPopup} />}
    </>
  );
};

export default AccountSettings;
