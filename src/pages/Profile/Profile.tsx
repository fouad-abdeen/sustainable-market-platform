import "./Profile.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { camelCaseToTitleCase } from "../../utility-functions";
import { UserContext } from "../../contexts/UserContext";
import { CustomerProfile, SellerProfile, UserRole } from "../../types/user";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { CategoryType } from "../../types/category";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(UserContext);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({} as CustomerProfile);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>({} as SellerProfile);

  const customerProfileKeys = ["firstName", "lastName", "phoneNumber", "address"];
  const sellerProfileKeys = [
    "name",
    "description",
    "phoneNumber",
    "address",
    "businessEmail",
    "categoryId",
    "itemCategories",
    "menuImageUrl",
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
        setCustomerProfile(user.profile as CustomerProfile);
      } else if (user.role === UserRole.SELLER) {
        setSellerProfile(user.profile as SellerProfile);
      }
    }

    if (user && categories.length > 0) {
      if (user.role === UserRole.SELLER) {
        const serviceCategory = (
          categories.find(
            (category) =>
              category.type === CategoryType.SERVICE &&
              category.id === ((user.profile as SellerProfile) ?? {}).categoryId
          ) ?? { name: "" }
        ).name;

        const itemCategories = categories
          .filter((category) => category.type === CategoryType.ITEM)
          .filter((category) =>
            ((user.profile as SellerProfile).itemCategories ?? []).includes(category.id)
          )
          .map((category) => category.name);

        setSellerProfile({
          ...(user.profile as SellerProfile),
          ["categoryId"]: serviceCategory,
          ["itemCategories"]: itemCategories,
        });
      }
    }
  }, [user, categories]);

  return (
    <div className="user-profile">
      <h2>Profile</h2>
      <div className="profile-details">
        {user ? (
          <>
            <div className="profile-row">
              <div className="profile-label">Account Status:</div>
              {user.verified ? (
                <div className="profile-value" style={{ color: "#5cb25d" }}>
                  Active
                </div>
              ) : (
                <div className="profile-value" style={{ color: "#dd4a48" }}>
                  Inactive
                </div>
              )}
            </div>

            <div className="profile-row">
              <div className="profile-label">Email:</div>
              <div className="profile-value">{user.email}</div>
            </div>

            <div className="profile-row"></div>
            {user.role === UserRole.CUSTOMER
              ? customerProfileKeys.map((key) => {
                  return (customerProfile as any)[key] ? (
                    <div className="profile-row" key={key}>
                      <div className="profile-label">{camelCaseToTitleCase(key)}</div>
                      <div className="profile-value">{(customerProfile as any)[key]}</div>
                    </div>
                  ) : (
                    <></>
                  );
                })
              : user.role === UserRole.SELLER &&
                sellerProfileKeys.map((key) => {
                  const itemCategories = (sellerProfile["itemCategories"] ?? []).join(", ");
                  return (sellerProfile as any)[key] ? (
                    <div className="profile-row" key={key}>
                      <div className="profile-label">
                        {key === "categoryId"
                          ? "Service Category:"
                          : key === "logoUrl"
                          ? "Logo:"
                          : camelCaseToTitleCase(key)}
                      </div>
                      <div className="profile-value">
                        {key === "itemCategories" ? (
                          itemCategories || (
                            <span style={{ color: "#dd4a48" }}>
                              No assigned item categories yet.
                            </span>
                          )
                        ) : key === "logoUrl" ? (
                          <img
                            src={(sellerProfile as any)[key]}
                            style={{ objectFit: "contain", width: "200px", height: "200px" }}
                          />
                        ) : (
                          (sellerProfile as any)[key]
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  );
                })}
          </>
        ) : (
          <h4>No available profile information.</h4>
        )}
      </div>
    </div>
  );
};

export default Profile;
