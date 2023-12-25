import "./Home.css";
import { useContext } from "react";
import { SellersContext } from "../../contexts/SellersContext";
import { useNavigate } from "react-router-dom";
import { CategoriesContext } from "../../contexts/CategoriesContext";

function Home() {
  const navigate = useNavigate();
  const { sellers } = useContext(SellersContext);
  const { categories } = useContext(CategoriesContext);

  const servicesData = [
    {
      id: 1,
      title: "Eco-Friendly Products",
      description: "Explore a wide range of sustainable and eco-friendly products.",
      icon: "https://static.vecteezy.com/system/resources/previews/013/965/458/original/eco-green-eco-friendly-icon-recycle-logo-packaging-renewable-symbol-green-environmentally-sign-vector.jpg", // Replace with actual image path or icon class
    },
    {
      id: 2,
      title: "Fair Trade Partnerships",
      description: "Support fair trade practices with our ethical partnerships.",
      icon: "https://www.pngitem.com/pimgs/m/265-2650663_green-trade-fair-trade-marketing-icon-png-transparent.png",
    },
    // {
    //   id: 3,
    //   title: "Recycling Services",
    //   description: "Efficient recycling solutions for a greener environment.",
    //   icon: "https://img.freepik.com/premium-vector/green-recycling-symbol-icon-eco-cycle-elimination-garbage_572038-206.jpg",
    // },
  ];

  return (
    <>
      <div className="hero-container">
        <div className="slogan">
          <h1>Discover Sustainable Living</h1>
          <p>Explore a World of Eco-Friendly Products for a Greener Future.</p>
          <button className="cta-button" onClick={() => navigate(`sellers`)}>
            Shop Now
          </button>
        </div>
      </div>
      <section className="new-sellers-section">
        <h2>New Sellers</h2>
        <div className="seller-list">
          {sellers
            .slice(0, 3)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((seller, index) => (
              <div className="seller-card" key={seller.id}>
                <img
                  title="Click to view seller details"
                  src={
                    index === 0
                      ? "http://localhost:3030/files?id=658726af06f1b73c16aacf62"
                      : "http://localhost:3030/files?id=65872f474901e2e4d79951f4"
                  }
                  style={{ objectFit: "contain", width: "200px", height: "200px" }}
                  onClick={() => navigate(`sellers/${seller.id}`)}
                />
                <h3>{seller.name}</h3>
                <h4>
                  {(categories.find((category) => category.id === seller.categoryId) ?? {}).name ??
                    ""}
                </h4>
                {seller.description && (
                  <p className="seller-description">
                    {seller.description.slice(0, 200)}
                    {seller.description.length > 200 ? (
                      <i
                        className="read-more-description"
                        onClick={() => navigate(`sellers/${seller.id}`)}
                      >
                        ... Read More
                      </i>
                    ) : (
                      ""
                    )}
                  </p>
                )}
              </div>
            ))}
        </div>
      </section>
      <section className="our-services-section">
        <h2>Our Services</h2>
        <div className="service-cards">
          {servicesData.map((service) => (
            <div className="service-card" key={service.id}>
              <img
                src={service.icon}
                alt={service.title}
                style={{ objectFit: "contain", width: "200px", height: "200px" }}
              />
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
            Welcome to Sustainable Market, your one-stop destination for eco-friendly and
            sustainable products.
          </p>
          <p>
            At Sustainable Market, we are passionate about promoting a greener and more sustainable
            future for everyone. Our mission is to provide you with access to a wide range of
            environmentally friendly products that are sourced responsibly and produced with care
            for the planet.
          </p>
          <p>
            We believe that small changes in our everyday choices can have a big impact on the
            world. That's why we offer a carefully curated selection of products that are not only
            good for you but also good for the environment.
          </p>
          <p>
            Our team is dedicated to ensuring that every product you find on our platform meets
            high-quality standards and aligns with our commitment to sustainability. Whether you're
            looking for reusable household items, organic beauty products, or sustainable fashion,
            you'll find it here.
          </p>
          <p>
            Join us in making a positive difference. Together, we can create a more sustainable and
            greener world for future generations.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
