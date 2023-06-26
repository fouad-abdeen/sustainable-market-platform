import "./Footer.css";

function Footer() {
  return (
    <>
      <footer>
        <div className="footer-container">
          <div className="footer-item">
            <a href="#" className="footer-link">
              About Us
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Contact Us
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Delivery Information
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Refund Policy
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Private Policy
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Terms of Service
            </a>
          </div>
          <div className="footer-item">
            <a href="#" className="footer-link">
              Our Brands
            </a>
          </div>
        </div>
        <p className="copyright">
          &copy; 2023 The Sustainable Community. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Footer;
