import { useEffect, useState } from 'react';
import "./product.css"

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

const ProductDetail: React.FC = () => {
  // Static product data (you can replace this with your actual data)
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // Static product data (you can replace this with your actual data)
    const staticProduct: Product = {
      id: 1,
      name: 'Eco-Friendly Water Bottle',
      description: 'Stay hydrated and eco-friendly with this reusable water bottle.',
      price: '$12.99',
      image: 'https://media.cntraveler.com/photos/631fb09e65480b69a20b052a/master/w_2240,c_limit/Best%20Water%20Bottles-2022_Yetti%20RAMBLER%2026%20OZ%20WATER%20BOTTLE.jpg', // Replace with the actual image URL
      stock: 0,
    };

    setProduct(staticProduct);
  }, []);

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="product-price">{product.price}</p>
        <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              max={product.stock} // Set the maximum quantity based on stock
            />
            <button
              className="add-to-cart"
              disabled={quantity > product.stock || quantity < 1}
            >
              {quantity > product.stock ? 'Out of Stock' : 'Add to Cart'}
            </button>
      </div>
    </div>
  );
};

export default ProductDetail;