import "./Home.css";
import { newVendors,servicesData } from "../../data";
function Home() {
  {
    return (
      <>
        <div className="hero-container">
          <div className="slogan">
            <h1>Discover Sustainable Living</h1>
            <p>
              Explore a World of Eco-Friendly Products for a Greener Future.
            </p>
            <button className="cta-button">Shop Now</button>
          </div>
        </div>
        <section className="new-vendors-section">
          <h2>New Vendors</h2>
          <div className="vendor-list">
            {newVendors.map((vendor) => (
              <div className="vendor-card" key={vendor.id}>
                <img src={vendor.image} alt={vendor.name} />
                <h3>{vendor.name}</h3>
                <p>{vendor.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="our-services-section">
      <h2>Our Services</h2>
      <div className="service-cards">
        {servicesData.map((service) => (
          <div className="service-card" key={service.id}>
            {/* Service icon */}
            <img src={service.icon} alt={service.title} />

            {/* Service title and description */}
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="about-us-section">
      <div className="about-us-card">
        <h2>About Us</h2>
        <p>
          Welcome to Sustainable Market, your one-stop destination for eco-friendly and sustainable products.
        </p>
        <p>
          At Sustainable Market, we are passionate about promoting a greener and more sustainable future for everyone. Our mission is to provide you with access to a wide range of environmentally friendly products that are sourced responsibly and produced with care for the planet.
        </p>
        <p>
          We believe that small changes in our everyday choices can have a big impact on the world. That's why we offer a carefully curated selection of products that are not only good for you but also good for the environment.
        </p>
        <p>
          Our team is dedicated to ensuring that every product you find on our platform meets high-quality standards and aligns with our commitment to sustainability. Whether you're looking for reusable household items, organic beauty products, or sustainable fashion, you'll find it here.
        </p>
        <p>
          Join us in making a positive difference. Together, we can create a more sustainable and greener world for future generations.
        </p>
      </div>
    </section>
      </>
    );
  }
}

export default Home;
