import "./Wishlist.css";
import Card from "../../components/Card/Card";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../contexts/WishlistContext";
import { UserContext } from "../../contexts/UserContext";
import { SellerInfo, UserRole } from "../../types/user";
import { SellersContext } from "../../contexts/SellersContext";

function Wishlist() {
  const navigate = useNavigate();
  const { wishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);
  const { sellers } = useContext(SellersContext);

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
    }
  }, [user]);

  const getItemSeller = (sellerId: string) => {
    return sellers.find((seller) => seller.id === sellerId) ?? ({} as SellerInfo);
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      <div className="card-container">
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          wishlist.map((item, index) => (
            <Card key={index} item={item} seller={getItemSeller(item.sellerId ?? "")} />
          ))
        )}
      </div>
    </div>
  );
}

export default Wishlist;
