import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCaretDown,
  faEarthAsia,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

function Navbar() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  return (
    <>
      <nav>
        <div className="brand">
          <a href="#">
            <h1>
              The Sustainable Community <FontAwesomeIcon icon={faEarthAsia} />
            </h1>
          </a>
        </div>
        <ul
          className={isMobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setIsMobile(false)}
        >
          <a href="#" className="nav-item mobile-item dropdown">
            <li>
              Explore <FontAwesomeIcon icon={faCaretDown} />
            </li>
          </a>
          <a href="#" className="nav-item mobile-item dropdown">
            <li>
              Shop <FontAwesomeIcon icon={faCaretDown} />
            </li>
          </a>
          <a href="#" className="nav-item mobile-item">
            <li>Become a vendor</li>
          </a>
          {isMobile ? (
            <a href="#" className="signup-button-mobile">
              <li>Signup</li>
            </a>
          ) : null}
        </ul>
        <a className="signup" href="#">
          <div className="signup-button">Sign up</div>
        </a>
        <FontAwesomeIcon
          className="mobile-menu-icon"
          icon={isMobile ? faXmark : faBars}
          onClick={() => setIsMobile(!isMobile)}
        />
      </nav>
    </>
  );
}

export default Navbar;
