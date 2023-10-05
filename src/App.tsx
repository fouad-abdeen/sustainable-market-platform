import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/product/ProductDetail"
function App() {
  return (
    <>
      <Navbar />
      <ProductDetail />
      <Footer/>
      {/* <Footer /> */}
    </>
  );
}

export default App;
