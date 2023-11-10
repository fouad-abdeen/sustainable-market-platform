import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/Signup";
import SignIn from "./pages/SignIn/SignIn";
import Seller from "./pages/Seller/Seller";
import { UserContext } from "./contexts/UserContext";
import { SetStateAction, useEffect, useState } from "react";
import { SellerInfo, User, UserRole } from "./types/user";
import Wishlist from "./pages/Wishlist/Wishlist";
import { WishlistItem } from "./types/item";
import { WishlistContext } from "./contexts/WishlistContext";
import MyCart from "./pages/MyCart/MyCart";
import Profile from "./pages/Profile/Profile";
import { categoryApi, authApi, sellerApi, customerApi } from "./api-helpers";
import CheckoutInformation from "./pages/CheckoutInformation/CheckoutInformation";
import Checkout from "./pages/Checkout/Checkout";
import SellerItemList from "./pages/SellerItemList/SellerItemList";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import AdminUserManagement from "./pages/AdminUserManagement/AdminUserManagement";
import AdminMessages from "./pages/AdminMessages/AdminMessages";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import { CategoriesContext } from "./contexts/CategoriesContext";
import { CartResponse, CategoryResponse } from "./types/api-responses";
import { CartContext } from "./contexts/CartContext";
import { CustomerCheckoutInfo } from "./types/order";
import { CheckoutContext } from "./contexts/CheckoutContext";
import Orders from "./pages/Orders/Orders";
import RequestPasswordReset from "./pages/RequestPasswordReset/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import NotFound from "./pages/NotFound/NotFound";
import SellerList from "./pages/SellerList/SellerList";
import ContactUs from "./pages/ContactUs/ContactUs";
import { SellersContext } from "./contexts/SellersContext";
import ServiceCategories from "./pages/ServiceCategories/ServiceCategories";
import ItemCategories from "./pages/ItemCategories/ItemCategories";
import Item from "./pages/Item/Item";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<CustomerCheckoutInfo>(
    {} as CustomerCheckoutInfo
  );
  const [cart, setCart] = useState<CartResponse>({} as CartResponse);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [sellers, setSellers] = useState<SellerInfo[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") as string;

    (async () => {
      if (categories.length === 0) {
        const categoriesResponse = await categoryApi.getCategories();

        if (!categoriesResponse.data) {
          throw new Error("Server is not responding. Please try again later.");
        }

        setCategories(categoriesResponse.data);
      }

      if (sellers.length === 0) {
        const sellersResponse = await sellerApi.query({ activeSellers: true });

        if (!sellersResponse.data) {
          throw new Error("Server is not responding. Please try again later.");
        }

        setSellers(sellersResponse.data);
      }

      try {
        const user = await authApi.getAuhenticatedUser(accessToken);

        if (!user.data) {
          return;
        }

        setUser(user.data);

        try {
          if (user.data.role === UserRole.CUSTOMER) {
            const wishlistResponse = await customerApi.getWishlistItems(accessToken);

            if (wishlistResponse.data) {
              setWishlist(wishlistResponse.data);
            }
          }
        } catch (error) {
          return;
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, []);

  return (
    <>
      <CategoriesContext.Provider
        value={{
          categories,
          setCategories: setCategories as (
            categories: CategoryResponse[]
          ) => SetStateAction<CategoryResponse[]>,
        }}
      >
        <UserContext.Provider
          value={{
            user,
            setUser: setUser as (user: User | null) => SetStateAction<User | null>,
          }}
        >
          <Router>
            <NavBar />
            <Routes>
              <Route
                path="/"
                element={
                  <SellersContext.Provider
                    value={{
                      sellers,
                      setSellers: setSellers as (
                        sellers: SellerInfo[]
                      ) => SetStateAction<SellerInfo[]>,
                    }}
                  >
                    <Home />
                  </SellersContext.Provider>
                }
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/sellers"
                element={
                  <SellersContext.Provider
                    value={{
                      sellers,
                      setSellers: setSellers as (
                        sellers: SellerInfo[]
                      ) => SetStateAction<SellerInfo[]>,
                    }}
                  >
                    <SellerList />
                  </SellersContext.Provider>
                }
              />
              <Route
                path="/sellers/:id"
                element={
                  <WishlistContext.Provider
                    value={{
                      wishlist,
                      setWishlist: setWishlist as (
                        wishlist: WishlistItem[]
                      ) => SetStateAction<WishlistItem[]>,
                    }}
                  >
                    <CartContext.Provider
                      value={{
                        cart,
                        setCart: setCart as (cart: CartResponse) => SetStateAction<CartResponse>,
                      }}
                    >
                      <Seller />
                    </CartContext.Provider>
                  </WishlistContext.Provider>
                }
              />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/wishlist"
                element={
                  <WishlistContext.Provider
                    value={{
                      wishlist,
                      setWishlist: setWishlist as (
                        wishlist: WishlistItem[]
                      ) => SetStateAction<WishlistItem[]>,
                    }}
                  >
                    <CartContext.Provider
                      value={{
                        cart,
                        setCart: setCart as (cart: CartResponse) => SetStateAction<CartResponse>,
                      }}
                    >
                      <SellersContext.Provider
                        value={{
                          sellers,
                          setSellers: setSellers as (
                            sellers: SellerInfo[]
                          ) => SetStateAction<SellerInfo[]>,
                        }}
                      >
                        <Wishlist />
                      </SellersContext.Provider>
                    </CartContext.Provider>
                  </WishlistContext.Provider>
                }
              />
              <Route
                path="/cart"
                element={
                  <CartContext.Provider
                    value={{
                      cart,
                      setCart: setCart as (cart: CartResponse) => SetStateAction<CartResponse>,
                    }}
                  >
                    <MyCart />
                  </CartContext.Provider>
                }
              />
              <Route
                path="/checkout/information"
                element={
                  <CheckoutContext.Provider
                    value={{
                      checkoutInfo,
                      setCheckoutInfo: setCheckoutInfo as (
                        checkoutInfo: CustomerCheckoutInfo
                      ) => SetStateAction<CustomerCheckoutInfo>,
                    }}
                  >
                    <CheckoutInformation />
                  </CheckoutContext.Provider>
                }
              />
              <Route
                path="/checkout/confirmation"
                element={
                  <CheckoutContext.Provider
                    value={{
                      checkoutInfo,
                      setCheckoutInfo: setCheckoutInfo as (
                        checkoutInfo: CustomerCheckoutInfo
                      ) => SetStateAction<CustomerCheckoutInfo>,
                    }}
                  >
                    <CartContext.Provider
                      value={{
                        cart,
                        setCart: setCart as (cart: CartResponse) => SetStateAction<CartResponse>,
                      }}
                    >
                      <Checkout />
                    </CartContext.Provider>
                  </CheckoutContext.Provider>
                }
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/items" element={<SellerItemList />} />
              <Route path="/items/:id" element={<Item />} />
              <Route path="/service-categories" element={<ServiceCategories />} />
              <Route path="/item-categories" element={<ItemCategories />} />
              <Route path="/users" element={<AdminUserManagement />} />
              <Route path="/messages" element={<AdminMessages />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/request-password-reset" element={<RequestPasswordReset />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </CategoriesContext.Provider>
      <Footer />
    </>
  );
}
export default App;
