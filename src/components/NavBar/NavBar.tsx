import React, { useContext, useState } from "react";
import "./NavBar.css";
import SustainableIcon from "../../assets/sustainable_icon.svg";
import IconMenu from "../../assets/icon-menu.svg";
import XSymbol from "../../assets/x-symbol.svg";
import Profile from "../../assets/profile-icon.png";
import Signout from "../../assets/signout-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api-helpers";
import { UserRole } from "../../types/user";
import { UserContext } from "../../contexts/UserContext";

function NavBar() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const previouslyAuthenticated = localStorage.getItem("previouslyAuthenticated");

  const handleSignout = async (event: React.MouseEvent<HTMLElement>) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    await authApi.signout(accessToken as string, refreshToken as string);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    (event.target as HTMLElement).style.display = "none";
    const signupButton = document.querySelector<HTMLDivElement>("#signup");
    if (signupButton) {
      signupButton.style.display = "block";
    }

    setUser(null);

    navigate("/");
  };

  return (
    <nav>
      <div className="brand">
        <Link to="/">
          {" "}
          <h1>Sustainable Market</h1>
        </Link>
        <img src={SustainableIcon}></img>
      </div>
      <ul
        className={showMobileMenu ? "nav-links-mobile" : "nav-links"}
        onClick={() => setShowMobileMenu(false)}
      >
        <Link to="/" className="Nav-item mobile-item">
          <li>Home</li>
        </Link>
        <Link to="/sellers" className="Nav-item mobile-item">
          <li>Sellers</li>
        </Link>
        <Link to="/contact-us" className="Nav-item mobile-item">
          <li>Contact us</li>
        </Link>
        {!user && (
          <Link
            to={previouslyAuthenticated ? "/signin" : "/signup"}
            id={previouslyAuthenticated ? "signin" : "signup"}
            className={"Nav-item mobile-item signup-button-mobile"}
          >
            <li>{previouslyAuthenticated ? "Sign In" : "Sign Up"}</li>
          </Link>
        )}
      </ul>

      {user ? (
        <div className="dropdown">
          <div style={{ cursor: "pointer" }}>
            <img src={Profile} style={{ width: 30, height: 30 }} />
          </div>

          <div className="dropdown-content">
            <Link to="/profile">Profile</Link>
            {user.role === UserRole.CUSTOMER && (
              <>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
              </>
            )}
            {user.role === UserRole.SELLER && (
              <>
                <Link to="/orders">Orders</Link>
                <Link to="/items">Items</Link>
              </>
            )}
            {user.role === UserRole.ADMIN && (
              <>
                <Link to="/users">Users</Link>
                <Link to="/items">Items</Link>
                <Link to="/service-categories">Service Categories</Link>
                <Link to="/item-categories">Item Categories</Link>
                <Link to="/messages">Messages</Link>
              </>
            )}
            <Link to="/account-settings">Account Settings</Link>
            <a style={{ cursor: "pointer" }} onClick={handleSignout}>
              <img src={Signout} style={{ width: 20, height: 20 }} /> Sign Out
            </a>
          </div>
        </div>
      ) : (
        <Link
          to={previouslyAuthenticated ? "/signin" : "/signup"}
          id={previouslyAuthenticated ? "signin" : "signup"}
          className={"signup-button"}
        >
          {previouslyAuthenticated ? "Sign In" : "Sign Up"}
        </Link>
      )}

      <img
        className="mobile-menu-icon"
        src={showMobileMenu ? XSymbol : IconMenu}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      ></img>
    </nav>
  );
}

export default NavBar;
