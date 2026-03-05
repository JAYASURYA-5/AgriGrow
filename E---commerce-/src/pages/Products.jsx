import React, { useContext } from 'react';
import ProductList from '../components/ProductList';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';

const Products = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show a toast notification here
    alert(`${product.name} added to cart!`);
  };

  return (
    <ProductList
      products={products}
      onAddToCart={handleAddToCart}
    />
  );
};

export default Products;
